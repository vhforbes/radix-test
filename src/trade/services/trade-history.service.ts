import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TradeHistory from '../entities/tade-history.entity';
import { Repository } from 'typeorm';
import Trade from '../entities/trade.entity';

@Injectable()
export class TradeHistoryService {
  constructor(
    @InjectRepository(TradeHistory)
    private tradeHistoryRepository: Repository<TradeHistory>,
  ) {}

  async create(trade: Trade) {
    console.log(trade);

    const tradeHistory = this.tradeHistoryRepository.create(trade);

    const existingVersions = await this.tradeHistoryRepository.find({
      where: {
        trade_id: trade.id,
      },
    });

    tradeHistory.trade_id = trade.id;
    tradeHistory.version = existingVersions.length + 1;

    await this.tradeHistoryRepository.save(tradeHistory);
  }
}
