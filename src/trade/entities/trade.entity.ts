import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TradeBase } from './base-trade.entity';

@Entity('trade')
class Trade extends TradeBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export default Trade;
