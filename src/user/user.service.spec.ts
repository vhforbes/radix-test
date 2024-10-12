import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import User from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { jwtServiceMock } from '@test/mocks/jwt/jwt.service.mock';
import { loggerMock } from '@test/mocks/logger/logger.mock';
import { ConfigService } from '@nestjs/config';
import { amqpConnectionMock } from '@test/mocks/rabbitmq/amqp-connection.mock';

describe('UserService', () => {
  let service: UserService;

  const userRepositoryMock = {
    provide: getRepositoryToken(User),
    useValue: {
      findOneBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        amqpConnectionMock,
        userRepositoryMock,
        jwtServiceMock,
        loggerMock,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
