import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateSensorReadingDto } from './dtos/create-sensor-reading.dto';
import { SensorReadingService } from './sensor-reading.service';
import { SensorReading } from './sensor-reading.entity';

@Controller('sensor-reading')
export class SensorReadingController {
  constructor(private readonly sensorReadingsService: SensorReadingService) {}

  @Post()
  async create(@Body() createSensorReadingDto: CreateSensorReadingDto) {
    return this.sensorReadingsService.create(createSensorReadingDto);
  }

  @Get()
  async findByEquipmentId(
    @Query('equipmentId') equipmentId: string,
  ): Promise<SensorReading[]> {
    return this.sensorReadingsService.findByEquipmentId(equipmentId);
  }

  @Get('average')
  async getAverageReadings(
    @Query('timePeriod') timePeriod?: string,
  ): Promise<any> {
    return this.sensorReadingsService.getAverageReadings(timePeriod);
  }
}
