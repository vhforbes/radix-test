import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Trade from './entities/trade.entity';
import { CreateTradeOperationDto } from './dtos/create.dto';
import { UserService } from '@src/user/user.service';
import { UserReq } from '@src/auth/interfaces';
import { TradeOperationStatus } from './trade.enum';
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
    createTradeOperationDto: CreateTradeOperationDto,
    userReq: UserReq,
  ): Promise<Trade> {
    try {
      const createdTradeOperation: Trade = this.tradeRepository.create(
        createTradeOperationDto,
      );

      createdTradeOperation.trader.id = userReq.user_id;

      createdTradeOperation.status = TradeOperationStatus.Awaiting;

      //   this.utils.validateEntryOrders(createdTradeOperation);
      //   this.utils.validateTakeProfitOrders(createdTradeOperation);

      //   createdTradeOperation.expectedMedianPrice =
      //     this.utils.calculateExpectedMedianPrice(createdTradeOperation);

      //   createdTradeOperation.expectedMedianTakeProfitPrice =
      //     this.utils.calculateMedianTakeProfit(
      //       createdTradeOperation.effectiveTakeProfitPrice,
      //       420,
      //       69,
      //     );

      //   if (
      //     createdTradeOperation.direction === TradeOperationDirection.Long &&
      //     createdTradeOperation.expectedMedianTakeProfitPrice <
      //       createdTradeOperation.expectedMedianPrice
      //   ) {
      //     throw new BadRequestException(
      //       'Operaçao de LONG. Seu preço médio precisa estar abaixo do take profit',
      //     );
      //   }

      //   if (
      //     createdTradeOperation.direction === TradeOperationDirection.Short &&
      //     createdTradeOperation.expectedMedianTakeProfitPrice >
      //       createdTradeOperation.expectedMedianPrice
      //   ) {
      //     throw new BadRequestException(
      //       'Operaçao de SHORT. Seu preço médio precisa estar acima do take profit',
      //     );
      //   }

      //   if (
      //     createdTradeOperation.direction === TradeOperationDirection.Long &&
      //     createdTradeOperation.expectedMedianPrice <=
      //       createdTradeOperation.stopPrice
      //   ) {
      //     throw new BadRequestException(
      //       'Operaçao de LONG. Seu STOP precisa estar abaixo do seu preço médio',
      //     );
      //   }

      //   if (
      //     createdTradeOperation.direction === TradeOperationDirection.Short &&
      //     createdTradeOperation.expectedMedianPrice >=
      //       createdTradeOperation.stopPrice
      //   ) {
      //     throw new BadRequestException(
      //       'Operaçao de LONG. Seu stop precisa estar acima do seu preço médio',
      //     );
      //   }

      //   const stopDistance = this.utils.calculateStopDistance(
      //     createdTradeOperation,
      //   );

      //   createdTradeOperation.stopDistance = stopDistance;

      const result = await this.tradeRepository.save(createdTradeOperation);

      // ---- TODO ----
      //
      // Start a CRON checker to check prices
      //
      // ---- TODO ----

      //   delete result.user;

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
