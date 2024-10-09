import Community from '@src/community/community.entity';
import User from '@src/user/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.memberships)
  user: User;

  @ManyToOne(() => Community, (community) => community.memberships)
  community: Community;
}
