import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvUpload } from '@src/csv-upload/csv-upload.entity';
import { Equipment } from '@src/equipment/equipment.entity';
import { SensorReading } from '@src/sensor-reading/sensor-reading.entity';
import User from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: true, // !! Set to false in production !!
        entities: [User, SensorReading, Equipment, CsvUpload],
      }),
    }),
  ],
})
export class DatabaseModule {}
