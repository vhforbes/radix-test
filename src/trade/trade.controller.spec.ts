import { Test, TestingModule } from '@nestjs/testing';
import { TradeController } from './trade.controller';
import { TradeService } from './services/trade.service';

describe('TradeController', () => {
  let controller: TradeController;

  const tradeServiceMock = {
    provide: TradeService,
    useValue: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeController],
      providers: [tradeServiceMock],
    }).compile();

    controller = module.get<TradeController>(TradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
