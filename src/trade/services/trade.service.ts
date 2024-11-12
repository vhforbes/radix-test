import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import Trade from '../entities/trade.entity';
import { CreateTradeDto } from '../dtos/create-trade.dto';
import { UserService } from '@src/user/user.service';
import { UserReq } from '@src/auth/interfaces';
import { TradeDirection, TradeResult, TradeStatus } from '../trade.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerConfig } from '@src/common/message-broker/message-broker.config';
import { UpdateTradeDto } from '../dtos/update-trade.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TradeService {
  constructor(
    private logger: Logger,
    private userService: UserService,
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,
    private readonly amqpConnection: AmqpConnection,
    private eventEmitter: EventEmitter2,
  ) {}

  async getTrades(options?: Partial<Trade>) {
    if (!options || Object.keys(options).length === 0) {
      return await this.tradeRepository.find();
    }

    const where: FindOptionsWhere<Trade> = {};

    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && value !== null) {
        (where as any)[key] = value;
      }
    }

    return await this.tradeRepository.find({
      where,
    });
  }

  async findOne(id: string) {
    const trade = await this.tradeRepository.findOne({
      where: {
        id: id,
      },
    });

    return trade;
  }

  async create(
    createTradeDto: CreateTradeDto,
    userReq: UserReq,
  ): Promise<Trade> {
    const newTrade: Trade = this.tradeRepository.create(createTradeDto);
    const user = await this.userService.findOne(userReq.email);

    delete user.password;

    newTrade.trader = user;
    newTrade.status = TradeStatus.Awaiting;

    const processedTrade = this.processTrade(newTrade);

    await this.tradeRepository.save(processedTrade);

    await this.amqpConnection.publish(
      MessageBrokerConfig.trade.exchanges.tradeExchange,
      MessageBrokerConfig.trade.routingKeys.tradeCreated,
      processedTrade,
    );

    this.eventEmitter.emit('trade.created');

    return processedTrade;
  }

  async update(id: string, updatedTradeOperationDto: UpdateTradeDto) {
    const tradeToUpdate = await this.findOne(id);

    if (!tradeToUpdate) {
      throw new BadRequestException('Trade not found');
    }

    const updatedTrade = {
      ...tradeToUpdate,
      ...updatedTradeOperationDto,
    };

    const processedTrade = this.processTrade(updatedTrade);

    await this.tradeRepository.update(id, processedTrade);

    await this.amqpConnection.publish(
      MessageBrokerConfig.trade.exchanges.tradeExchange,
      MessageBrokerConfig.trade.routingKeys.tradeUpdated,
      processedTrade,
    );

    this.eventEmitter.emit('trade.updated');

    return processedTrade;
  }

  async checkTradeUpdate(trade: Trade, currentPrice: number) {
    await this.entryOrderTrigger(trade, currentPrice);
    await this.takeProfitTrigger(trade, currentPrice);
    await this.stopTrigger(trade, currentPrice);
  }

  async entryOrderTrigger(trade: Trade, currentPrice: number) {
    if (trade.status === TradeStatus.Closed) {
      return;
    }

    const ordersHit = [];

    trade.entry_orders.forEach((order) => {
      if (trade.direction === TradeDirection.Long && order >= currentPrice) {
        ordersHit.push(currentPrice);
      }

      if (trade.direction === TradeDirection.Short && order <= currentPrice) {
        ordersHit.push(currentPrice);
      }
    });

    const entry_percentage: number = trade.percentual_by_entry.reduce(
      (sum, percentage, index) => {
        if (index < ordersHit.length) {
          return sum + percentage;
        }

        return sum;
      },
    );

    if (ordersHit.length === trade.triggered_entry_orders?.length) return;
    if (!ordersHit.length) return;

    const effective_median_price = this.calculateEffectiveMedianPrice({
      ...trade,
      triggered_entry_orders: ordersHit,
    });

    const updatedTrade = await this.update(trade.id, {
      entry_percentage,
      triggered_entry_orders: ordersHit,
      status: TradeStatus.Active,
      effective_median_price,
    });

    return updatedTrade;
  }

  async takeProfitTrigger(trade: Trade, currentPrice: number) {
    if (trade.status !== TradeStatus.Active) {
      return;
    }

    const ordersHit = [];

    trade.take_profit_orders.forEach((order) => {
      if (trade.direction === TradeDirection.Long && order <= currentPrice) {
        ordersHit.push(currentPrice);
      }

      if (trade.direction === TradeDirection.Short && order <= currentPrice) {
        ordersHit.push(currentPrice);
      }
    });

    if (!ordersHit.length) return;

    const closed_percentage: number = trade.percentual_by_take_profit.reduce(
      (sum, percentage, index) => {
        if (index < ordersHit.length) {
          return sum + percentage;
        }

        return sum;
      },
    );

    const tradeClosed = closed_percentage === 100;

    console.log('CLOSING TRADE: ', tradeClosed);

    const effective_take_profit_price = tradeClosed
      ? this.calculateEffectiveTakeProfit(trade)
      : null;

    const updatedTrade = await this.update(trade.id, {
      closed_percentage,
      triggered_take_profit_orders: ordersHit,
      status: tradeClosed ? TradeStatus.Closed : TradeStatus.Active,
      effective_take_profit_price,
    });

    return updatedTrade;
  }

  async stopTrigger(trade: Trade, currentPrice: number) {
    if (
      trade.direction === TradeDirection.Long &&
      trade.stop_price >= currentPrice
    ) {
      console.log('triggering stop long');

      await this.update(trade.id, {
        status: TradeStatus.Closed,
        result: TradeResult.Loss,
        triggered_stop: true,
      });

      return true;
    }

    if (
      trade.direction === TradeDirection.Short &&
      trade.stop_price <= currentPrice
    ) {
      console.log('triggering stop short');

      await this.update(trade.id, {
        status: TradeStatus.Closed,
        result: TradeResult.Loss,
        triggered_stop: true,
      });

      return true;
    }

    return;
  }

  // ---- Private Methods ----

  private processTrade(newTrade: Trade) {
    if (!this.validEntryOrders(newTrade))
      throw new BadRequestException('Invalid entry orders');

    if (!this.validateTakeProfitOrders(newTrade)) {
      throw new BadRequestException('Invalid take profit orders');
    }

    if (newTrade.percentual_by_entry.length !== newTrade.entry_orders.length) {
      throw new BadRequestException(
        'The number of entry orders and percentual by entry must be the same',
      );
    }

    if (
      newTrade.percentual_by_take_profit.length !==
      newTrade.take_profit_orders.length
    ) {
      throw new BadRequestException(
        'The number of take profit orders and percentual by take profit must be the same',
      );
    }

    newTrade.expected_median_price = this.calculateExpectedMedianPrice(
      newTrade.entry_orders,
      newTrade.percentual_by_entry,
    );

    newTrade.expected_median_take_profit_price =
      this.calculateExpectedMedianPrice(
        newTrade.take_profit_orders,
        newTrade.percentual_by_take_profit,
      );

    if (
      newTrade.direction === TradeDirection.Long &&
      newTrade.expected_median_price >
        newTrade.expected_median_take_profit_price
    ) {
      throw new BadRequestException(
        'Your median price bust be bellow take profit for a Long',
      );
    }

    if (
      newTrade.direction === TradeDirection.Short &&
      newTrade.expected_median_take_profit_price >
        newTrade.expected_median_price
    ) {
      throw new BadRequestException(
        'Your median price bust be above take profit for a Short',
      );
    }

    if (
      newTrade.direction === TradeDirection.Long &&
      newTrade.expected_median_price <= newTrade.stop_price
    ) {
      throw new BadRequestException('Your stop need to be bellow median price');
    }

    if (
      newTrade.direction === TradeDirection.Short &&
      newTrade.expected_median_price >= newTrade.stop_price
    ) {
      throw new BadRequestException('Your stop need to be above median price');
    }

    const stopDistance = this.calculateStopDistance(newTrade);

    newTrade.stop_distance = stopDistance;

    return newTrade;
  }

  private validEntryOrders(trade: Trade) {
    if (trade.direction === TradeDirection.Long) {
      if (this.isDescending(trade.entry_orders)) {
        return true;
      }
    }

    if (trade.direction === TradeDirection.Short) {
      if (this.isAscending(trade.entry_orders)) {
        return true;
      }
    }

    return false;
  }

  private isAscending(array: number[]) {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        return false;
      }
    }
    return true;
  }

  private isDescending(array: number[]) {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] < array[i + 1]) {
        return false;
      }
    }
    return true;
  }

  private validateTakeProfitOrders(trade: Trade) {
    if (trade.direction === TradeDirection.Long) {
      if (!this.isAscending(trade.take_profit_orders)) {
        return false;
      }
    }

    if (trade.direction === TradeDirection.Short) {
      if (!this.isDescending(trade.take_profit_orders)) {
        return false;
      }
    }

    return true;
  }

  private calculateExpectedMedianPrice(
    orders: number[],
    percentuals: number[],
  ): number {
    let totalWeightedPrice = 0;
    let totalPercentage = 0;

    orders.forEach((order, index) => {
      const percentual = percentuals[index] / 100;
      totalWeightedPrice += order * percentual;
      totalPercentage += percentual;
    });

    if (totalPercentage !== 1) {
      throw new BadRequestException(
        'Total entry orders percentage does not sum up to 100%',
      );
    }

    return totalWeightedPrice;
  }

  private calculateStopDistance(trade: Trade): number {
    const difference = Math.abs(trade.expected_median_price - trade.stop_price);

    const percentualDistance = difference / trade.expected_median_price;

    return percentualDistance;
  }

  private calculateEffectiveTakeProfit(trade: Trade): number {
    if (
      trade.take_profit_orders.length !== trade.percentual_by_take_profit.length
    ) {
      console.error('Take profit orders and percentuals lenght don`t match');

      this.logger.error(
        'Take profit orders and percentuals lenght don`t match',
      );
      throw new Error('Take profit orders and percentuals lenght don`t match');
    }

    let effectiveTakeProfit = 0;

    trade.take_profit_orders.forEach((tp, i) => {
      const percentualClosed = trade.percentual_by_take_profit[i] / 100;
      const wheightedTp = tp * percentualClosed;

      effectiveTakeProfit += wheightedTp;
    });

    return effectiveTakeProfit;
  }

  private calculateEffectiveMedianPrice(trade: Trade): number {
    let effectiveMedianPrice = 0;

    // Filter entry orders and percentages to only consider triggered orders
    const triggeredOrders = trade.entry_orders.filter((_, i) =>
      trade.triggered_entry_orders.includes(trade.entry_orders[i]),
    );
    const triggeredPercentages = trade.percentual_by_entry.filter((_, i) =>
      trade.triggered_entry_orders.includes(trade.entry_orders[i]),
    );

    // Calculate the sum of triggered percentages
    const totalTriggeredPercentage = triggeredPercentages.reduce(
      (a, b) => a + b,
      0,
    );

    // Calculate the effective median price based on normalized weights
    triggeredOrders.forEach((tp, i) => {
      const normalizedWeight =
        triggeredPercentages[i] / totalTriggeredPercentage;
      effectiveMedianPrice += tp * normalizedWeight;
    });

    return effectiveMedianPrice;
  }
}
