import Community from '@src/community/community.entity';
import User from '@src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MembershipRole } from './membership-roles.enum';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.memberships)
  user: User;

  @ManyToOne(() => Community, (community) => community.memberships)
  community: Community;

  @Column({
    type: 'enum',
    enum: MembershipRole,
    default: MembershipRole.MEMBER,
  })
  role: MembershipRole;

  @CreateDateColumn({ type: 'timestamptz' })
  joined_at: Date;

  // TODO: Subscription Module
}
