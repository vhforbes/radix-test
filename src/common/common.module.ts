import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [DatabaseModule, AwsModule],
})
export class CommonModule {}
