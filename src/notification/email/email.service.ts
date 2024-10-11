import { SESv2 } from '@aws-sdk/client-sesv2';
import { Injectable, Logger } from '@nestjs/common';
import { InjectAws } from 'aws-sdk-v3-nest';

@Injectable()
export class EmailService {
  constructor(
    @InjectAws(SESv2) private readonly sesClient: SESv2,
    private readonly logger: Logger,
  ) {}

  async sendEmail() {
    this.logger.log('Sending email trough SES');

    const content = {
      FromEmailAddress: 'victor@victorhugoforbes.com',
      Destination: {
        ToAddresses: ['recipient@example.com'], // Replace with the actual recipient email
        CcAddresses: [],
        BccAddresses: [],
      },
      Content: {
        Simple: {
          Subject: {
            Data: 'Test Email Subject',
            Charset: 'UTF-8',
          },
          Body: {
            Text: {
              Data: 'This is a test email sent from AWS SES.',
              Charset: 'UTF-8',
            },
            Html: {
              Data: '<h1>This is a test email sent from AWS SES.</h1>',
              Charset: 'UTF-8',
            },
          },
        },
      },
    };

    try {
      await this.sesClient.sendEmail(content);
    } catch (error) {
      this.logger.error('Could not send email ', {
        error: error,
        message: error.message,
      });
    }
  }
}
