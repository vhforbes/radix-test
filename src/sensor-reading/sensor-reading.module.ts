import { Module } from '@nestjs/common';
import { SensorReading } from './sensor-reading.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorReadingService } from './sensor-reading.service';
import { SensorReadingController } from './sensor-reading.controller';
import { EquipmentModule } from '@src/equipment/equipment.module';

@Module({
  imports: [EquipmentModule, TypeOrmModule.forFeature([SensorReading])],
  controllers: [SensorReadingController],
  providers: [SensorReadingService],
  exports: [SensorReadingService],
})
export class SensorReadingModule {}
