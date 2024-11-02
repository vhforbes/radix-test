import { Injectable, Logger } from '@nestjs/common';
import { TradeService } from '@src/trade/services/trade.service';
import { Exchange, TradeStatus } from '@src/trade/trade.enum';
import { WebSocket } from 'ws';

@Injectable()
export class WebSocketOrchestratorService {
  private connections: Map<string, WebSocket> = new Map();

  constructor(
    private logger: Logger,
    private tradeService: TradeService,
  ) {
    this.openWsConnectionsNeeded();
  }

  async openWsConnectionsNeeded() {
    this.logger.log('Obtaining trade operations needed for WS connections');

    const activeTrades = await this.tradeService.getTrades({
      status: TradeStatus.Active,
    });

    const awaitingTrades = await this.tradeService.getTrades({
      status: TradeStatus.Active,
    });

    const trades = activeTrades.concat(awaitingTrades);

    trades.forEach((trade) =>
      this.connectToExchange(trade.pair, trade.exchange),
    );
  }

  connectToExchange(pair: string, exchange: Exchange) {
    const connectionKey = `${exchange}:${pair}`;

    if (this.connections.has(connectionKey)) {
      this.logger.log(`Connection for ${connectionKey} already exists.`);
      return;
    }

    // Todo: This will need improvement based on exchange probably
    const wsUrl = `wss://stream.binance.com:9443/ws/${pair.toLocaleLowerCase()}@trade`;

    const ws = new WebSocket(wsUrl);

    this.connections.set(connectionKey, ws);

    ws.on('open', () => {
      this.logger.log(`Connected to ${wsUrl}`);
    });

    ws.on('message', (data: string) => {
      const tradeData = JSON.parse(data);
      this.logger.debug(
        `Received trade data from ${wsUrl}: ${JSON.stringify(tradeData)}`,
      );

      // Emit trade data through the TradeGateway
      // I will probably emmit data regarding the profi/loss of the trade
      //   this.tradeGateway.broadcastTradeData({ url: wsUrl, tradeData });
    });

    ws.on('close', () => {
      this.logger.warn(`WebSocket connection closed: ${wsUrl}`);
      this.connections.delete(connectionKey);
    });

    ws.on('error', (error) => {
      this.logger.error(`WebSocket error on ${wsUrl}: ${error.message}`);
    });
  }

  disconnectFromExchange(pair: string, exchange: string) {
    const connectionKey = `${exchange}:${pair}`;
    const ws = this.connections.get(connectionKey);
    if (ws) {
      ws.close();
      this.connections.delete(connectionKey);
      this.logger.log(`Disconnected from ${connectionKey}`);
    }
  }

  isConnectionActive(pair: string, exchange: string): boolean {
    const connectionKey = `${exchange}:${pair}`;
    return this.connections.has(connectionKey);
  }
}
