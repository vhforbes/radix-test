import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TradeBase } from './base-trade.entity';

@Entity('trade_history')
class TradeHistory extends TradeBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  trade_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column('bigint')
  version: number;
}

export default TradeHistory;
