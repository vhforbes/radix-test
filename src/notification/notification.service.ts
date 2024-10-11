import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';

@Injectable()
export class NotificationService {
  constructor(private emailService: EmailService) {}

  async sendNotification() {
    await this.emailService.sendEmail();
  }
}
