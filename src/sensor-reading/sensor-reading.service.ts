import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSensorReadingDto } from './dtos/create-sensor-reading.dto';
import { SensorReading } from './sensor-reading.entity';

@Injectable()
export class SensorReadingService {
  constructor(
    @InjectRepository(SensorReading)
    private readonly sensorReadingRepository: Repository<SensorReading>,
  ) {}

  async create(
    createSensorReadingDto: CreateSensorReadingDto,
  ): Promise<SensorReading> {
    const reading = this.sensorReadingRepository.create({
      ...createSensorReadingDto,
      timestamp: new Date(createSensorReadingDto.timestamp),
    });

    return this.sensorReadingRepository.save(reading);
  }
}
