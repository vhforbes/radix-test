import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { CreateSensorReadingDto } from './dtos/create-sensor-reading.dto';
import { SensorReadingService } from './sensor-reading.service';
import { SensorReading } from './sensor-reading.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';

@ApiTags('sensor-reading')
@Controller('sensor-reading')
export class SensorReadingController {
  constructor(private readonly sensorReadingsService: SensorReadingService) {}

  @Post()
  async create(@Body() createSensorReadingDto: CreateSensorReadingDto) {
    return this.sensorReadingsService.create(createSensorReadingDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findByEquipmentId(
    @Query('equipmentId') equipmentId: string,
  ): Promise<SensorReading[]> {
    return this.sensorReadingsService.findByEquipmentId(equipmentId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('average')
  async getAverageReadings(
    @Query('timePeriod') timePeriod?: string,
  ): Promise<any> {
    return this.sensorReadingsService.getAverageReadings(timePeriod);
  }
}
