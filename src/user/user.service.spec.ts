import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import User from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

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
      providers: [UserService, userRepositoryMock, Logger],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
