import { Test, TestingModule } from '@nestjs/testing';
import { SensorReadingService } from './sensor-reading.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SensorReading } from './sensor-reading.entity';
import { EquipmentService } from '../equipment/equipment.service';
import { Repository } from 'typeorm';
import { loggerMock } from '@test/mocks/logger/logger.mock';

describe('SensorReadingsService', () => {
  let service: SensorReadingService;
  let repo: Repository<SensorReading>;

  const mockEquipmentService = {
    findById: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorReadingService,
        loggerMock,
        {
          provide: getRepositoryToken(SensorReading),
          useClass: Repository,
        },
        {
          provide: EquipmentService,
          useValue: mockEquipmentService,
        },
      ],
    }).compile();

    service = module.get<SensorReadingService>(SensorReadingService);
    repo = module.get<Repository<SensorReading>>(
      getRepositoryToken(SensorReading),
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a sensor reading and register new equipment if not found', async () => {
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

    mockEquipmentService.findById.mockResolvedValueOnce(null);
    jest.spyOn(repo, 'create').mockReturnValue(createdReading);
    jest.spyOn(repo, 'save').mockResolvedValue(createdReading);

    const result = await service.create(dto);

    expect(mockEquipmentService.findById).toHaveBeenCalledWith(dto.equipmentId);
    expect(mockEquipmentService.create).toHaveBeenCalledWith({
      equipmentId: dto.equipmentId,
      name: 'Default',
    });
    expect(repo.create).toHaveBeenCalledWith({
      ...dto,
      timestamp: new Date(dto.timestamp),
    });
    expect(repo.save).toHaveBeenCalledWith(createdReading);
    expect(result).toEqual(createdReading);
  });

  it('should create a sensor reading if equipment exists', async () => {
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

    mockEquipmentService.findById.mockResolvedValueOnce({
      equipmentId: dto.equipmentId,
      name: 'Existing Equipment',
    });
    jest.spyOn(repo, 'create').mockReturnValue(createdReading);
    jest.spyOn(repo, 'save').mockResolvedValue(createdReading);

    const result = await service.create(dto);

    expect(mockEquipmentService.findById).toHaveBeenCalledWith(dto.equipmentId);
    expect(mockEquipmentService.create).not.toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalledWith({
      ...dto,
      timestamp: new Date(dto.timestamp),
    });
    expect(repo.save).toHaveBeenCalledWith(createdReading);
    expect(result).toEqual(createdReading);
  });
});
