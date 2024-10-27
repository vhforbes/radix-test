import { Test, TestingModule } from '@nestjs/testing';
import { TradeHistoryService } from './trade-history.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import TradeHistory from '../entities/tade-history.entity';
import { repositoryMockFactory } from '@test/mocks/repositoryMockFactory';

describe('TradeHistoryService', () => {
  let service: TradeHistoryService;

  const tradeHistoryRepositoryMock = {
    provide: getRepositoryToken(TradeHistory),
    useValue: repositoryMockFactory(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeHistoryService, tradeHistoryRepositoryMock],
    }).compile();

    service = module.get<TradeHistoryService>(TradeHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
