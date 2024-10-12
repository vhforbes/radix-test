import { EmailService } from '@src/notification/email/email.service';

export const emailServiceMock = {
  provide: EmailService,
  useValue: {
    sendEmail: jest.fn(),
  },
};
