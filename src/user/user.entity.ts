import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-roles.enum';

@Entity('user')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: string;

  @Column({ type: 'boolean', default: false })
  confirmed: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

export default User;
