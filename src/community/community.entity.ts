import { Membership } from '@src/membership/membership.entity';
import User from '@src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommunityStatus } from './community-status.enum.dto';

@Entity('community')
class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: CommunityStatus,
    default: CommunityStatus.PENDING_APPROVAL,
    nullable: false,
  })
  status: CommunityStatus;

  @Column({ default: 'BRL', nullable: false })
  currency: string;

  @Column({ type: 'int', default: 3, nullable: false })
  max_traders: number;

  @Column({ type: 'int', default: 5, nullable: false })
  max_vips: number;

  @Column({ nullable: true })
  description: string;

  // THIS MAKES SENSE?
  // @Column({ type: 'enum', enum: CommunityType, default: CommunityType.Standard })
  // community_type: CommunityType;

  @ManyToOne(() => User, (user) => user.comunities_owned, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Membership, (membership) => membership.community)
  memberships: Membership[];
}

export default Community;
