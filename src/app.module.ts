import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommunityModule } from './community/community.module';
import { MembershipModule } from './membership/membership.module';

import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    CommonModule,
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    CommunityModule,
    MembershipModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
