import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommunityModule } from './community/community.module';
import { MembershipModule } from './membership/membership.module';
import { NotificationModule } from './notification/notification.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    CommunityModule,
    MembershipModule,
    NotificationModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
