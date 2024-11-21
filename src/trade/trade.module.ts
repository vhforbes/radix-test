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
import { WebsocketModule } from '@src/websocket/websocket.module';
import { TradeTrackerService } from './services/trade-tracker.service';
import { MembershipModule } from '@src/membership/membership.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Trade, TradeHistory]),
    NotificationModule,
    WebsocketModule,
    MembershipModule,
  ],
  providers: [
    TradeSubscriber,
    TradeService,
    TradeHistoryService,
    TradeTrackerService,
  ],
  controllers: [TradeController],
  exports: [TradeService],
})
export class TradeModule {}
