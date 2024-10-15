import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';
import { SubscriptionPlanStatus } from './enums/subscription-plan-status.enum';

@Entity()
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('decimal', { nullable: false, precision: 10, scale: 2 })
  monthly_price: number;

  @Column('decimal', { nullable: false, precision: 10, scale: 2 })
  yearly_price: number;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];

  @Column({ type: 'enum', enum: SubscriptionPlanStatus })
  status: SubscriptionPlanStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
