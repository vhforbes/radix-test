import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TradeService } from './trade.service';
import { TradeStatus } from '../trade.enum';
import { WebSocketOrchestratorService } from '@src/websocket/websocker-orchestrator.service';
import Trade from '../entities/trade.entity';
import { PriceUpdatedEvent } from '@src/websocket/events/price-updated.event';

@Injectable()
export class TradeTrackerService {
  trades: Trade[];

  constructor(
    private tradeService: TradeService,
    private webSocketOrchestratorService: WebSocketOrchestratorService,
  ) {
    this.trackTrades();
  }

  @OnEvent('price.updated')
  async checkTrade(payload: PriceUpdatedEvent) {
    const matchingTrades = this.trades.filter(
      (trade) =>
        trade.exchange === payload.exchange && trade.pair === payload.pair,
    );

    matchingTrades.forEach((trade) =>
      this.tradeService.checkTradeUpdate(trade, payload.price),
    );
  }

  @OnEvent('trade.updated')
  @OnEvent('trade.created')
  async trackTrades() {
    const activeTrades = await this.tradeService.getTrades({
      status: TradeStatus.Awaiting,
    });

    const awaitingTrades = await this.tradeService.getTrades({
      status: TradeStatus.Active,
    });

    this.trades = activeTrades.concat(awaitingTrades);

    this.webSocketOrchestratorService.openWsConnectionsNeeded(this.trades);
  }
}
