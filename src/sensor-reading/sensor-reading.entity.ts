import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('sensor-reading')
export class SensorReading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  equipmentId: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'float' })
  value: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
