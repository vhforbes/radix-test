import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import Trade from '../entities/trade.entity';

@EventSubscriber()
export class TradeSubscriber implements EntitySubscriberInterface<Trade> {
  listenTo() {
    return Trade;
  }

  beforeInsert(event: InsertEvent<Trade>): Promise<any> | void {
    console.log(event);
  }
}
