import Community from '@src/community/community.entity';
import User from '@src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MembershipRole } from './membership-roles.enum';
import { Subscription } from '@src/subscription/subscription.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.memberships)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Community, (community) => community.memberships)
  @JoinColumn({ name: 'community_id' })
  community: Community;

  @OneToMany(() => Subscription, (subscription) => subscription.membership)
  subscriptions: Subscription[];

  @Column({
    type: 'enum',
    enum: MembershipRole,
    default: MembershipRole.MEMBER,
  })
  role: MembershipRole;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
