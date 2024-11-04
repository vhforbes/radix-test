import { Injectable } from '@nestjs/common';
import { Exchange } from '@src/trade/trade.enum';
import { BinanceTradeWsResponse } from '../interfaces/binance-trade.interface';
import { PriceUpdatedEvent } from '../events/price-updated.event';
import { AbstractExchangeConnectionService } from './abstract-exchange-connection.service';

// ** Theres the possibility to create a class that abstracts the exchange, so i would have one class that receives a base ws url param, and the trades for this exchanges, this would avoid multiple classes with the same methods and functionalities
@Injectable()
export class BinanceConnectionService extends AbstractExchangeConnectionService {
  getWsUrl(pair: string): string {
    return `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@trade`;
  }

  protected handleMessage(data: string, wsUrl: string) {
    const tradeData: BinanceTradeWsResponse = JSON.parse(data);
    this.logger.debug(
      `Received trade data from ${wsUrl}: ${JSON.stringify(tradeData)}`,
    );

    this.eventEmitter.emit(
      'price.updated',
      new PriceUpdatedEvent(
        Exchange.BINANCE,
        tradeData.s,
        parseFloat(tradeData.p),
      ),
    );
  }
}
