import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSensorReadingDto } from './dtos/create-sensor-reading.dto';
import { SensorReading } from './sensor-reading.entity';
import { EquipmentService } from '@src/equipment/equipment.service';

@Injectable()
export class SensorReadingService {
  constructor(
    @InjectRepository(SensorReading)
    private readonly sensorReadingRepository: Repository<SensorReading>,

    @Inject(EquipmentService)
    private readonly equipmentService: EquipmentService,

    private logger: Logger,
  ) {}

  async create(
    createSensorReadingDto: CreateSensorReadingDto,
  ): Promise<SensorReading> {
    const equipment = await this.equipmentService.findById(
      createSensorReadingDto.equipmentId,
    );

    if (!equipment) {
      await this.equipmentService.create({
        equipmentId: createSensorReadingDto.equipmentId,
        name: 'Default',
      });

      this.logger.log('Regitering new equipment');
    }

    const reading = this.sensorReadingRepository.create({
      ...createSensorReadingDto,
      timestamp: new Date(createSensorReadingDto.timestamp),
    });

    return this.sensorReadingRepository.save(reading);
  }
}
