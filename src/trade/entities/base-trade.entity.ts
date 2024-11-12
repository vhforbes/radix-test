import Community from '@src/community/community.entity';
import User from '@src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  Exchange,
  TradeDirection,
  TradeResult,
  TradeStatus,
} from '../trade.enum';

export abstract class TradeBase {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'trader_id' })
  trader: User;

  @ManyToOne(() => Community)
  @JoinColumn({ name: 'community_id' })
  community: Community;

  // -- General Data --
  @Column()
  pair: string;

  @Column({
    nullable: true,
    enum: ['spot', 'futures'],
  })
  market: string;

  @Column({
    nullable: true,
    enum: Exchange,
  })
  exchange: Exchange;

  @Column({
    type: 'varchar',
    length: 10,
    enum: TradeDirection,
  })
  direction: string;

  @Column({ nullable: true })
  observation?: string;

  // -- Position Control --
  @Column({
    type: 'varchar',
    length: 10,
    enum: TradeStatus,
  })
  status: string;

  @Column({ nullable: true })
  entry_percentage?: number;

  @Column({ nullable: true })
  closed_percentage?: number;

  // -- Entry Orders --
  @Column('float', { array: true })
  entry_orders: number[];

  @Column('float', { array: true })
  percentual_by_entry: number[];

  @Column('float', { nullable: true, array: true })
  triggered_entry_orders?: number[];

  @Column('float', { nullable: true })
  expected_median_price?: number;

  @Column('float', { nullable: true })
  effective_median_price?: number;

  // -- Take Profit Orders --
  @Column('float', { array: true })
  take_profit_orders: number[];

  // Must SUM 100%
  @Column('float', { array: true })
  percentual_by_take_profit: number[];

  @Column('float', { nullable: true, array: true })
  triggered_take_profit_orders?: number[];

  @Column('float', { nullable: true })
  expected_median_take_profit_price?: number;

  @Column('float', { nullable: true })
  effective_take_profit_price?: number;

  // -- Stop Order --
  @Column({ type: 'float' })
  stop_price: number;

  @Column({ nullable: true, type: 'boolean' })
  triggered_stop?: boolean;

  @Column({ type: 'float', nullable: true })
  stop_distance?: number;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 10,
    enum: TradeResult,
  })
  result?: string;

  @Column({ type: 'float', nullable: true })
  percentual_result?: number;

  // -- Other Data --
  @Column({ nullable: true })
  trading_view_link?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
