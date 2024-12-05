import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CsvUploadStatus {
  FAILURE = 'failure',
  PROCESSED_WITH_ERRORS = 'processed_with_errors',
  PROCESSED = 'processed',
}

@Entity('csv_upload')
export class CsvUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string; // File name for tracking

  @Column('text', { nullable: true })
  errors: string | null; // Store errors as a string or JSON, for easy debugging

  @Column({
    type: 'enum',
    enum: CsvUploadStatus,
    default: CsvUploadStatus.PROCESSED,
  })
  status: CsvUploadStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
