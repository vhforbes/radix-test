import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AwsModule } from './aws/aws.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [DatabaseModule, AwsModule, LoggerModule],
})
export class CommonModule {}
