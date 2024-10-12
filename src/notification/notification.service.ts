import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerConfig } from '@src/common/message-broker/message-broker.config';
import { UserCreatedEvent } from '@src/common/message-broker/interfaces/user-created-event.interface';

@Injectable()
export class NotificationService {
  constructor(
    private emailService: EmailService,
    private logger: Logger,
  ) {}

  @RabbitSubscribe({
    exchange: MessageBrokerConfig.user.exchanges.userExchange,
    routingKey: MessageBrokerConfig.user.routingKeys.userCreated,
    queue: MessageBrokerConfig.user.queues.userEmailQueue,
  })
  public async handleUserCreation(msg: UserCreatedEvent) {
    this.logger.log(
      `Received message for user creation: ${JSON.stringify(msg)}`,
    );

    await this.emailService.sendUserCreationEmail(
      msg.email,
      msg.name,
      msg.confirmationToken,
    );
  }
}
