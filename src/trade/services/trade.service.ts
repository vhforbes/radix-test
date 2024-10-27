import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Trade from '../entities/trade.entity';
import { CreateTradeDto } from '../dtos/create.dto';
import { UserService } from '@src/user/user.service';
import { UserReq } from '@src/auth/interfaces';
import { TradeStatus } from '../trade.enum';
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
    try {
      const createdTrade: Trade = this.tradeRepository.create(createTradeDto);
      const user = await this.userService.findOne(userReq.email);

      createdTrade.trader = user;

      createdTrade.status = TradeStatus.Awaiting;

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

      const result = await this.tradeRepository.save(createdTrade);

      // ---- TODO ----
      //
      // Start a CRON checker to check prices
      //
      // ---- TODO ----

      delete result.trader.password;

      return result;
    } catch (error) {
      // Logger error here
      console.log(error);

      throw new InternalServerErrorException(
        'Um erro desconhecido ocorreu ao criar a operação',
      );
    }
  }
}
