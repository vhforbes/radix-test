import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { userServiceMock } from '@test/mocks/user/user.service.mock';
import { repositoryMockFactory } from '@test/mocks/repositoryMockFactory';
import { getRepositoryToken } from '@nestjs/typeorm';
import Trade from '../entities/trade.entity';
import { userMock } from '@test/mocks/user/user.mock';
import { UserReq } from '@src/auth/interfaces';
import { Exchange, TradeDirection, TradeStatus } from '../trade.enum';
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
      entry_orders: [300, 200, 100],
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
    expect(result).toHaveProperty('entry_orders', [300, 200, 100]);
    expect(result).toHaveProperty('trader');
    expect(result.trader).not.toHaveProperty('password');
    expect(result).toEqual(expect.objectContaining(createTradeDto));
  });

  it('should call entryOrderTrigger trigger and entry on partial position', async () => {
    const tradeToEnter = {
      pair: 'BNBUSDT',
      market: 'futures',
      exchange: Exchange.BINANCE,
      direction: TradeDirection.Long,
      status: TradeStatus.Awaiting,
      entry_orders: [100, 90, 80],
      percentual_by_entry: [25, 25, 50],
      take_profit_orders: [150, 250, 350],
      percentual_by_take_profit: [50, 30, 20],
      closed_percentage: 0,
      stop_price: 70,
    } as Trade;

    const tradeToEnterResult = {
      ...tradeToEnter,
      status: TradeStatus.Active,
      entry_percentage: 50,
      effective_median_price: 95,
      expected_median_price: 87.5,
      expected_median_take_profit_price: 220,
      stop_distance: 0.2,
      triggered_entry_orders: [100, 90],
    } as Trade;

    tradeRepositoryMock.useValue.findOne.mockReturnValue(tradeToEnterResult);

    const result = await service.entryOrderTrigger(tradeToEnter, 89);

    expect(result).toEqual(tradeToEnterResult);
  });

  it('should call entryOrderTrigger trigger and entry on entire position', async () => {
    const tradeToEnter = {
      pair: 'BNBUSDT',
      market: 'futures',
      exchange: Exchange.BINANCE,
      direction: TradeDirection.Long,
      status: TradeStatus.Awaiting,
      entry_orders: [100, 90, 80],
      percentual_by_entry: [25, 25, 50],
      take_profit_orders: [150, 250, 350],
      percentual_by_take_profit: [50, 30, 20],
      closed_percentage: 0,
      stop_price: 70,
    } as Trade;

    const tradeToEnterResult = {
      ...tradeToEnter,
      status: TradeStatus.Active,
      entry_percentage: 100,
      effective_median_price: 87.5,
      expected_median_price: 87.5,
      expected_median_take_profit_price: 220,
      stop_distance: 0.2,
      triggered_entry_orders: [100, 90, 80],
    } as Trade;

    tradeRepositoryMock.useValue.findOne.mockReturnValue(tradeToEnterResult);

    const result = await service.entryOrderTrigger(tradeToEnter, 80);

    expect(result).toEqual(tradeToEnterResult);
  });

  it('should call takeProfitTrigger trigger and take profit on partial position', async () => {
    const tradeToTakeProfit = {
      pair: 'BNBUSDT',
      market: 'futures',
      exchange: Exchange.BINANCE,
      direction: TradeDirection.Long,
      status: TradeStatus.Active,
      entry_orders: [300, 200, 100],
      percentual_by_entry: [30, 40, 30],
      take_profit_orders: [150, 250, 350],
      percentual_by_take_profit: [50, 30, 20],
      closed_percentage: 0,

      stop_price: 90,
    } as Trade;

    const takeProfitResult = {
      ...tradeToTakeProfit,
      closed_percentage: 50,
      effective_take_profit_price: null,
      expected_median_price: 200,
      expected_median_take_profit_price: 220,
      stop_distance: 0.55,
      triggered_take_profit_orders: [150],
    } as Trade;

    tradeRepositoryMock.useValue.findOne.mockReturnValue(tradeToTakeProfit);

    const result = await service.takeProfitTrigger(tradeToTakeProfit, 160);

    expect(result).toEqual(takeProfitResult);
  });

  it('should call takeProfitTrigger trigger and take profit on entire position', async () => {
    const tradeToTakeProfit = {
      pair: 'BNBUSDT',
      market: 'futures',
      exchange: Exchange.BINANCE,
      direction: TradeDirection.Long,
      status: TradeStatus.Active,
      entry_orders: [300, 200, 100],
      percentual_by_entry: [30, 40, 30],
      take_profit_orders: [150, 250, 350],
      percentual_by_take_profit: [50, 30, 20],
      closed_percentage: 0,

      stop_price: 90,
    } as Trade;

    const takeProfitResult = {
      ...tradeToTakeProfit,
      status: TradeStatus.Closed,
      closed_percentage: 100,
      effective_take_profit_price: 220,
      expected_median_price: 200,
      expected_median_take_profit_price: 220,
      stop_distance: 0.55,
      triggered_take_profit_orders: [150, 250, 350],
    } as Trade;

    tradeRepositoryMock.useValue.findOne.mockReturnValue(tradeToTakeProfit);

    const result = await service.takeProfitTrigger(tradeToTakeProfit, 360);

    expect(result).toEqual(takeProfitResult);
  });
});
