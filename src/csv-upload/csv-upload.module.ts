import { Module } from '@nestjs/common';
import { CsvUploadController } from './csv-upload.controller';
import { CsvUploadService } from './csv-upload.service';
import { SensorReadingModule } from '@src/sensor-reading/sensor-reading.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvUpload } from './csv-upload.entity';

@Module({
  imports: [SensorReadingModule, TypeOrmModule.forFeature([CsvUpload])],
  controllers: [CsvUploadController],
  providers: [CsvUploadService],
})
export class CsvUploadModule {}
