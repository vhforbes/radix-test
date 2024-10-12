import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { sesClientMock } from '@test/mocks/aws/ses/ses-client.mock';
import { loggerMock } from '@test/mocks/logger/logger.mock';

// Mocking a decorator
jest.mock('aws-sdk-v3-nest', () => ({
  InjectAws: () => () => {},
}));

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, sesClientMock, loggerMock],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
