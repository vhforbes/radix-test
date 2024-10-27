import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { userServiceMock } from '@test/mocks/user/user.service.mock';
import { repositoryMockFactory } from '@test/mocks/repositoryMockFactory';
import { getRepositoryToken } from '@nestjs/typeorm';
import Trade from '../entities/trade.entity';

describe('TradeService', () => {
  let service: TradeService;

  const tradeRepositoryMock = {
    provide: getRepositoryToken(Trade),
    useValue: repositoryMockFactory(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeService, userServiceMock, tradeRepositoryMock],
    }).compile();

    service = module.get<TradeService>(TradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
