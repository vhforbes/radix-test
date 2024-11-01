import { Module } from '@nestjs/common';
import { TradeSubscriber } from './subscribers/trade.subscriber';
import { TradeController } from './trade.controller';
import { TradeService } from './services/trade.service';
import { UserModule } from '@src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Trade from './entities/trade.entity';
import { TradeHistoryService } from './services/trade-history.service';
import TradeHistory from './entities/tade-history.entity';
import { NotificationModule } from '@src/notification/notification.module';
import { PriceModule } from './price/price.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Trade, TradeHistory]),
    NotificationModule,
    PriceModule,
  ],
  providers: [TradeSubscriber, TradeService, TradeHistoryService],
  controllers: [TradeController],
})
export class TradeModule {}
