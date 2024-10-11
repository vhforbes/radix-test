import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AwsModule } from '@src/common/aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [EmailService],
})
export class EmailModule {}
