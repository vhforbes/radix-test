import { SESv2 } from '@aws-sdk/client-sesv2';
import { Injectable, Logger } from '@nestjs/common';
import { InjectAws } from 'aws-sdk-v3-nest';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  constructor(
    @InjectAws(SESv2) private readonly sesClient: SESv2,
    private readonly logger: Logger,
  ) {}

  private async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    textBody?: string,
  ) {
    this.logger.log(`Sending email to ${to}`);

    const emailContent = {
      FromEmailAddress: 'hey@victorhugoforbes.com',
      Destination: {
        ToAddresses: [to],
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Text: {
              Data: textBody || '',
              Charset: 'UTF-8',
            },
            Html: {
              Data: htmlBody,
              Charset: 'UTF-8',
            },
          },
        },
      },
    };

    try {
      await this.sesClient.sendEmail(emailContent);
    } catch (error) {
      this.logger.error('Failed to send email', { error: error.message });
    }
  }

  async sendUserCreationEmail(
    to: string,
    name: string,
    confirmEmailToken: string,
  ) {
    const subject = 'Welcome to Our Platform!';
    const htmlBody = this.getEmailTemplate('user-creation', {
      name,
      confirmEmailToken,
    });
    const textBody = `Hello ${name}, welcome to our platform!`;

    await this.sendEmail(to, subject, htmlBody, textBody);
  }

  private getEmailTemplate(
    templateName: string,
    variables: Record<string, string>,
  ) {
    const templatePath = path.resolve(
      __dirname,
      `./templates/${templateName}.html`,
    );

    let template = fs.readFileSync(templatePath, 'utf8');

    // * Chat GPT Magic *
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, variables[key]);
    });

    return template;
  }
}
