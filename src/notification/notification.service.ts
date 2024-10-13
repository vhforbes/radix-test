import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerConfig } from '@src/common/message-broker/message-broker.config';
import { UserCreatedEvent } from '@src/common/message-broker/interfaces/user-created-event.interface';
import { UserRecoverEvent } from '@src/common/message-broker/interfaces/user-recover-event.interface';

@Injectable()
export class NotificationService {
  constructor(
    private emailService: EmailService,
    private logger: Logger,
  ) {}

  @RabbitSubscribe({
    exchange: MessageBrokerConfig.user.exchanges.userExchange,
    routingKey: MessageBrokerConfig.user.routingKeys.userCreated,
    queue: MessageBrokerConfig.user.queues.createUserEmailQueue,
  })
  public async handleUserCreation(msg: UserCreatedEvent, amqpMsg: any) {
    this.logger.log(
      `Received message: ${JSON.stringify(msg)}, Routing Key: ${amqpMsg.fields.routingKey}`,
    );

    await this.emailService.sendUserCreationEmail(
      msg.email,
      msg.name,
      msg.confirmationToken,
    );
  }

  @RabbitSubscribe({
    exchange: MessageBrokerConfig.user.exchanges.userExchange,
    routingKey: MessageBrokerConfig.user.routingKeys.userRecover,
    queue: MessageBrokerConfig.user.queues.recoverUserEmailQueue,
  })
  public async handleUserRecovery(msg: UserRecoverEvent) {
    this.logger.log(
      `Received message for user recovery: ${JSON.stringify(msg)}`,
    );

    await this.emailService.sendUserRecoveryEmail(
      msg.email,
      msg.name,
      msg.recoveryToken,
    );
  }
}
