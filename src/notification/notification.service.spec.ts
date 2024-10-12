import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { emailServiceMock } from '@test/mocks/notification/email.service.mock';
import { loggerMock } from '@test/mocks/logger/logger.mock';
import { sesClientMock } from '@test/mocks/aws/ses/ses-client.mock';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService, emailServiceMock, loggerMock],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
