import { Exchange } from '@src/trade/trade.enum';

export class PriceUpdatedEvent {
  exchange: Exchange;
  pair: string;
  price: number;

  constructor(exchange: Exchange, pair: string, price: number) {
    this.exchange = exchange;
    this.pair = pair;
    this.price = price;
  }
}
