import User from '@src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comunity')
class Comunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.comunities_owned)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}

export default Comunity;
