import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class NotificationService {
  constructor(
    private emailService: EmailService,
    private logger: Logger,
  ) {}

  @RabbitSubscribe({
    exchange: 'user-exchange',
    routingKey: 'user.created',
    queue: 'user-email-queue',
  })
  public async handleUserCreation(msg: { email: string; name: string }) {
    this.logger.log(
      `Received message for user creation: ${JSON.stringify(msg)}`,
    );

    this.sendNotification();
  }

  async sendNotification() {
    await this.emailService.sendEmail();
  }
}
