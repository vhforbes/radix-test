import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerConfig } from '@src/common/message-broker/message-broker.config';
import { UserCreatedEvent } from '@src/common/message-broker/interfaces/user-created-event.interface';
import { UserRecoverEvent } from '@src/common/message-broker/interfaces/user-recover-event.interface';
import Trade from '@src/trade/entities/trade.entity';

@Injectable()
export class NotificationService {
  constructor(
    private emailService: EmailService,
    private logger: Logger,
  ) {}

  @RabbitRPC({
    exchange: MessageBrokerConfig.user.exchanges.userExchange,
    queue: MessageBrokerConfig.user.queues.userEmailQueue,
    routingKey: MessageBrokerConfig.user.routingKeys.userCreated,
  })
  public async handleUserCreation(msg: UserCreatedEvent, amqpMsg: any) {
    this.logger.log(
      `Received handleUserCreation message: ${JSON.stringify(msg)}, Routing Key: ${amqpMsg.fields.routingKey}`,
    );

    await this.emailService.sendUserCreationEmail(
      msg.email,
      msg.name,
      msg.confirmationToken,
    );
  }

  @RabbitRPC({
    exchange: MessageBrokerConfig.user.exchanges.userExchange,
    routingKey: MessageBrokerConfig.user.routingKeys.userRecover,
  })
  public async handleUserRecovery(msg: UserRecoverEvent, amqpMsg: any) {
    this.logger.log(
      `Received handleUserRecovery message: ${JSON.stringify(msg)}, Routing Key: ${amqpMsg.fields.routingKey}`,
    );

    await this.emailService.sendUserRecoveryEmail(
      msg.email,
      msg.name,
      msg.recoveryToken,
    );

    return 'message sent';
  }

  @RabbitRPC({
    exchange: MessageBrokerConfig.trade.exchanges.tradeExchange,
    queue: MessageBrokerConfig.trade.queues.newTradeQueue,
    routingKey: MessageBrokerConfig.trade.routingKeys.tradeCreated,
  })
  public async handleNewTrade(msg: Trade, amqpMsg: any) {
    this.logger.log(
      `Received NEW TRADE message: ${JSON.stringify(msg)}, Routing Key: ${amqpMsg.fields.routingKey}, FIELDS: ${JSON.stringify(amqpMsg.fields)}`,
    );
  }

  @RabbitRPC({
    exchange: MessageBrokerConfig.trade.exchanges.tradeExchange,
    queue: MessageBrokerConfig.trade.queues.updateTradeQueue,
    routingKey: MessageBrokerConfig.trade.routingKeys.tradeUpdated,
  })
  public async handleNewTrade2(msg: Trade, amqpMsg: any) {
    this.logger.log(
      `Received UPDATED TRADE message: ${JSON.stringify(msg)}, Routing Key: ${amqpMsg.fields.routingKey}, FIELDS: ${JSON.stringify(amqpMsg.fields)}`,
    );

    return 'message sent';
  }
}
