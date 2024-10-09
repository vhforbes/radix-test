import Community from '@src/community/community.entity';
import User from '@src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './roles.enum';

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
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  joined_at: Date;

  // TODO: Subscription Module
}
