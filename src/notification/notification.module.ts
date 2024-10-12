import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailModule } from './email/email.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    EmailModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'user-exchange',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',

      // What are channels ??
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
