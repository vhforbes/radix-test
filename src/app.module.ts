import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './notification/notification.module';
import { SensorReadingModule } from './sensor-reading/sensor-reading.module';
import { EquipmentModule } from './equipment/equipment.module';
import { CsvUploadModule } from './csv-upload/csv-upload.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    NotificationModule,
    SensorReadingModule,
    EquipmentModule,
    CsvUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
