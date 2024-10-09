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

@Entity('comunity')
class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.comunities_owned)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Membership, (membership) => membership.community)
  memberships: Membership[];
}

export default Community;
