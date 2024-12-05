import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailModule } from './email/email.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerConfig } from '@src/common/message-broker/message-broker.config';

@Module({
  imports: [
    EmailModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: MessageBrokerConfig.user.exchanges.userExchange,
          type: 'topic',
        },
        {
          name: MessageBrokerConfig.trade.exchanges.tradeExchange,
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',

      channels: {
        'channel-1': {
          prefetchCount: 15,
          default: true,
        },
        'channel-2': {
          prefetchCount: 2,
        },
      },
    }),
  ],
  providers: [NotificationService],
  exports: [NotificationService, RabbitMQModule],
})
export class NotificationModule {}
