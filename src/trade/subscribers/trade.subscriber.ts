import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import Trade from '../entities/trade.entity';
import { TradeHistoryService } from '../services/trade-history.service';

@EventSubscriber()
export class TradeSubscriber implements EntitySubscriberInterface<Trade> {
  constructor(
    dataSource: DataSource,
    private tradeHistoryService: TradeHistoryService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Trade;
  }

  async afterInsert(event: InsertEvent<Trade>) {
    await this.tradeHistoryService.create(event.entity);
  }

  async afterUpdate(event: UpdateEvent<Trade>) {
    console.log(event.entity);

    await this.tradeHistoryService.create(event.entity as Trade);
  }
}
