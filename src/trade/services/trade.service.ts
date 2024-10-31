import { BadRequestException, Injectable } from '@nestjs/common';
import Trade from '../entities/trade.entity';
import { CreateTradeDto } from '../dtos/create-trade.dto';
import { UserService } from '@src/user/user.service';
import { UserReq } from '@src/auth/interfaces';
import { TradeDirection, TradeStatus } from '../trade.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerConfig } from '@src/common/message-broker/message-broker.config';
import { UpdateTradeDto } from '../dtos/update-trade.dto';

@Injectable()
export class TradeService {
  constructor(
    private userService: UserService,
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

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

    return processedTrade;
  }

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
      if (this.isAscending(trade.entry_orders)) {
        return true;
      }
    }

    if (trade.direction === TradeDirection.Short) {
      if (this.isDescending(trade.entry_orders)) {
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
}
