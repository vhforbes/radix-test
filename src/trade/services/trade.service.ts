import { BadRequestException, Injectable } from '@nestjs/common';
import Trade from '../entities/trade.entity';
import { CreateTradeDto } from '../dtos/create.dto';
import { UserService } from '@src/user/user.service';
import { UserReq } from '@src/auth/interfaces';
import { TradeDirection, TradeStatus } from '../trade.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TradeService {
  constructor(
    private userService: UserService,
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,
  ) {}

  async create(
    createTradeDto: CreateTradeDto,
    userReq: UserReq,
  ): Promise<Trade> {
    const newTrade: Trade = this.tradeRepository.create(createTradeDto);
    const user = await this.userService.findOne(userReq.email);
    delete user.password;

    if (!this.validEntryOrders(newTrade))
      throw new BadRequestException('Invalid entry orders');

    newTrade.trader = user;
    newTrade.status = TradeStatus.Awaiting;

    //   this.utils.validateEntryOrders(createdTrade);
    //   this.utils.validateTakeProfitOrders(createdTrade);

    //   createdTrade.expectedMedianPrice =
    //     this.utils.calculateExpectedMedianPrice(createdTrade);

    //   createdTrade.expectedMedianTakeProfitPrice =
    //     this.utils.calculateMedianTakeProfit(
    //       createdTrade.effectiveTakeProfitPrice,
    //       420,
    //       69,
    //     );

    //   if (
    //     createdTrade.direction === TradeDirection.Long &&
    //     createdTrade.expectedMedianTakeProfitPrice <
    //       createdTrade.expectedMedianPrice
    //   ) {
    //     throw new BadRequestException(
    //       'Operaçao de LONG. Seu preço médio precisa estar abaixo do take profit',
    //     );
    //   }

    //   if (
    //     createdTrade.direction === TradeDirection.Short &&
    //     createdTrade.expectedMedianTakeProfitPrice >
    //       createdTrade.expectedMedianPrice
    //   ) {
    //     throw new BadRequestException(
    //       'Operaçao de SHORT. Seu preço médio precisa estar acima do take profit',
    //     );
    //   }

    //   if (
    //     createdTrade.direction === TradeDirection.Long &&
    //     createdTrade.expectedMedianPrice <=
    //       createdTrade.stopPrice
    //   ) {
    //     throw new BadRequestException(
    //       'Operaçao de LONG. Seu STOP precisa estar abaixo do seu preço médio',
    //     );
    //   }

    //   if (
    //     createdTrade.direction === TradeDirection.Short &&
    //     createdTrade.expectedMedianPrice >=
    //       createdTrade.stopPrice
    //   ) {
    //     throw new BadRequestException(
    //       'Operaçao de LONG. Seu stop precisa estar acima do seu preço médio',
    //     );
    //   }

    //   const stopDistance = this.utils.calculateStopDistance(
    //     createdTrade,
    //   );

    //   createdTrade.stopDistance = stopDistance;

    await this.tradeRepository.save(newTrade);

    // ---- TODO ----
    //
    // Start a CRON checker to check prices
    //
    // ---- TODO ----

    return newTrade;
  }

  validEntryOrders(trade: Trade) {
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

  isAscending(array: number[]) {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        return false;
      }
    }
    return true;
  }

  isDescending(array: number[]) {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] < array[i + 1]) {
        return false;
      }
    }
    return true;
  }
}
