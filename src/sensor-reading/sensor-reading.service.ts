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

  async findByEquipmentId(equipmentId: string): Promise<SensorReading[]> {
    if (!equipmentId) {
      throw new Error('equipmentId is required');
    }

    return this.sensorReadingRepository.find({
      where: { equipmentId },
      order: { timestamp: 'ASC' },
    });
  }

  async getAverageReadings(timePeriod: string): Promise<any> {
    const now = new Date();
    let startDate: Date;

    switch (timePeriod) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
        break;
      case '48h':
        startDate = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago
        break;
      case '1w':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago
        break;
      case '1m':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 1 month ago
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
        break;
    }

    const query = `
      SELECT "equipmentId", AVG("value") as "averageValue"
      FROM "sensor-reading"
      WHERE "timestamp" >= $1
      GROUP BY "equipmentId"
      ORDER BY "equipmentId";
    `;

    const result = await this.sensorReadingRepository.query(query, [startDate]);

    return result;
  }
}
