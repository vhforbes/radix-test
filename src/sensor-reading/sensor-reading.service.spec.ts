import { Test, TestingModule } from '@nestjs/testing';
import { SensorReadingService } from './sensor-reading.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SensorReading } from './sensor-reading.entity';
import { Repository } from 'typeorm';

describe('SensorReadingsService', () => {
  let service: SensorReadingService;
  let repo: Repository<SensorReading>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorReadingService,
        {
          provide: getRepositoryToken(SensorReading),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SensorReadingService>(SensorReadingService);
    repo = module.get<Repository<SensorReading>>(
      getRepositoryToken(SensorReading),
    );
  });

  it('should create a sensor reading', async () => {
    const dto = {
      equipmentId: 'EQ-12495',
      timestamp: '2023-02-15T01:30:00.000-05:00',
      value: 78.42,
    };

    const createdReading = {
      id: 'some-id',
      equipmentId: dto.equipmentId,
      timestamp: new Date(dto.timestamp),
      value: dto.value,
      createdAt: new Date(),
    };

    jest.spyOn(repo, 'create').mockReturnValue(createdReading);
    jest.spyOn(repo, 'save').mockResolvedValue(createdReading);

    const result = await service.create(dto);

    expect(result.timestamp.toISOString()).toEqual(
      new Date(dto.timestamp).toISOString(),
    );
    expect(result.createdAt.toISOString()).toBeDefined();
    expect(repo.create).toHaveBeenCalledWith({
      ...dto,
      timestamp: new Date(dto.timestamp),
    });
    expect(repo.save).toHaveBeenCalledWith(createdReading);
  });
});
