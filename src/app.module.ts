import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommunityModule } from './community/community.module';
import { MembershipModule } from './membership/membership.module';
import { NotificationModule } from './notification/notification.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TradeModule } from './trade/trade.module';
import { WebsocketModule } from './websocket/websocket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    CommunityModule,
    MembershipModule,
    NotificationModule,
    SubscriptionModule,
    TradeModule,
    WebsocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
