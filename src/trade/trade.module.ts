import { Module } from '@nestjs/common';
import { TradeSubscriber } from './subscribers/trade.subscriber';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';

@Module({
  providers: [TradeSubscriber, TradeService],
  controllers: [TradeController],
})
export class TradeModule {}
