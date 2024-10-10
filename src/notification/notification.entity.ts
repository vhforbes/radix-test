import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationService } from './notification-services.enum';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationService })
  service: NotificationService;

  // For both of these, I could create a relation that points to a table of discord or telegram configuration, I'll try without it now
  @Column('varchar')
  bot_token?: string;

  @Column('varchar')
  target_id?: string;
}
