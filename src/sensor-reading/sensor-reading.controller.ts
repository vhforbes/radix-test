import { Body, Controller, Post } from '@nestjs/common';

import { CreateSensorReadingDto } from './dtos/create-sensor-reading.dto';
import { SensorReadingService } from './sensor-reading.service';

@Controller('sensor-readings')
export class SensorReadingController {
  constructor(private readonly sensorReadingsService: SensorReadingService) {}

  @Post()
  async create(@Body() createSensorReadingDto: CreateSensorReadingDto) {
    return this.sensorReadingsService.create(createSensorReadingDto);
  }
}
