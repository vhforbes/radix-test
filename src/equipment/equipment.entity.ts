import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('equipment')
export class Equipment {
  @PrimaryColumn()
  equipmentId: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
