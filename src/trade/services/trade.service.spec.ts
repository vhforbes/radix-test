import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { userServiceMock } from '@test/mocks/user/user.service.mock';
import { repositoryMockFactory } from '@test/mocks/repositoryMockFactory';
import { getRepositoryToken } from '@nestjs/typeorm';
import Trade from '../entities/trade.entity';
import { userMock } from '@test/mocks/user/user.mock';
import { UserReq } from '@src/auth/interfaces';
import { Exchange, TradeDirection } from '../trade.enum';
import { Logger } from '@nestjs/common';
import { amqpConnectionMock } from '@test/mocks/rabbitmq/amqp-connection.mock';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('TradeService', () => {
  let service: TradeService;

  const tradeRepositoryMock = {
    provide: getRepositoryToken(Trade),
    useValue: repositoryMockFactory(),
  };

  const userReqMock: UserReq = {
    user_id: '123',
    email: 'test@test.com',
    name: 'Name',
    role: 'role',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        TradeService,
        userServiceMock,
        tradeRepositoryMock,
        amqpConnectionMock,
        EventEmitter2,
      ],
    }).compile();

    service = module.get<TradeService>(TradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a trade', async () => {
    const createTradeDto = {
      pair: 'AAPLUSD',
      market: 'futures',
      exchange: Exchange.BINANCE,
      direction: TradeDirection.Long,
      entry_orders: [100, 200, 300],
      percentual_by_entry: [30, 40, 30],
      take_profit_orders: [150, 250, 350],
      percentual_by_take_profit: [50, 30, 20],
      stop_price: 95.5,
    };

    userServiceMock.useValue.findOne.mockReturnValue(userMock);
    tradeRepositoryMock.useValue.create.mockReturnValue(createTradeDto);

    const result = await service.create(createTradeDto, userReqMock);

    expect(result).toHaveProperty('pair', 'AAPLUSD');
    expect(result).toHaveProperty('market', 'futures');
    expect(result).toHaveProperty('exchange', 'binance');
    expect(result).toHaveProperty('direction', 'long');
    expect(result).toHaveProperty('entry_orders', [100, 200, 300]);
    expect(result).toHaveProperty('trader');
    expect(result.trader).not.toHaveProperty('password');
    expect(result).toEqual(expect.objectContaining(createTradeDto));
  });
});
