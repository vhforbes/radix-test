import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Trade from '@src/trade/entities/trade.entity';
import { Exchange } from '@src/trade/trade.enum';
import { WebSocket } from 'ws';
import { BinanceConnectionService } from './exchanges/binance-connection.service';

@Injectable()
export class WebSocketOrchestratorService {
  private connections: Map<string, WebSocket> = new Map();

  constructor(
    private logger: Logger,
    private eventEmitter: EventEmitter2,
    private binanceConnectionService: BinanceConnectionService,
  ) {}

  async openWsConnectionsNeeded(trades: Trade[]) {
    this.logger.log('Openning WS connections...');

    trades.forEach((trade) => {
      switch (trade.exchange) {
        case Exchange.BINANCE:
          this.binanceConnectionService.connectToExchange(
            trade.pair,
            trade.exchange,
          );
          break;

        default:
          break;
      }
    });
  }
}
