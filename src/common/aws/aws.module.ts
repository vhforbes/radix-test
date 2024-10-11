import { SESv2 } from '@aws-sdk/client-sesv2';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsSdkModule } from 'aws-sdk-v3-nest';

@Module({
  imports: [
    ConfigModule,
    AwsSdkModule.registerAsync({
      clientType: SESv2,
      useFactory: async () => {
        return new SESv2();
      },
    }),
  ],
  exports: [AwsSdkModule],
})
export class AwsModule {}
