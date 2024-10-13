import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { userMock } from '@test/mocks/user/user.mock';
import { amqpConnectionMock } from '@test/mocks/rabbitmq/amqp-connection.mock';

describe('AuthService', () => {
  let service: AuthService;

  const userServiceMock = {
    provide: UserService,
    useValue: {
      findOne: jest.fn(),
    },
  };

  const jwtServiceMock = {
    provide: JwtService,
    useValue: {
      signAsync: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userServiceMock,
        jwtServiceMock,
        ConfigService,
        Logger,
        amqpConnectionMock,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate the user password and return true', async () => {
    userServiceMock.useValue.findOne.mockResolvedValue(userMock);

    const bcryptCompare = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const result = await service.validateUser(
      userMock.email,
      userMock.password,
    );

    expect(result).toBeTruthy();
  });

  it('should validate the user password and return false', async () => {
    userServiceMock.useValue.findOne.mockResolvedValue(userMock);

    const bcryptCompare = jest.fn().mockResolvedValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const result = await service.validateUser('wrong@email.com', 'wrongpass');

    expect(result).toBeFalsy();
  });

  it('should return the user access_token', async () => {
    jwtServiceMock.useValue.signAsync.mockResolvedValue('valid_jwt');

    const result = await service.login(userMock);

    expect(result).toEqual({
      access_token: 'valid_jwt',
      refresh_token: 'valid_jwt',
    });
  });
});
