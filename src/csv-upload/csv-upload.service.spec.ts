import { Test, TestingModule } from '@nestjs/testing';
import { CsvUploadService } from './csv-upload.service';
import { SensorReadingService } from '../sensor-reading/sensor-reading.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CsvUpload, CsvUploadStatus } from './csv-upload.entity';
import { Repository } from 'typeorm';

describe('CsvUploadService', () => {
  let service: CsvUploadService;
  let sensorReadingServiceMock: Partial<SensorReadingService>;
  let csvUploadRepositoryMock: Partial<Repository<CsvUpload>>;

  beforeEach(async () => {
    sensorReadingServiceMock = {
      create: jest.fn(),
    };

    csvUploadRepositoryMock = {
      save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsvUploadService,
        {
          provide: SensorReadingService,
          useValue: sensorReadingServiceMock,
        },
        {
          provide: getRepositoryToken(CsvUpload),
          useValue: csvUploadRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CsvUploadService>(CsvUploadService);
  });

  describe('processCsv', () => {
    it('should successfully process a valid CSV', async () => {
      const validCsvContent = Buffer.from(`equipmentId,timestamp,value
      EQUIP001,2023-06-15T10:00:00Z,25.5
      EQUIP002,2023-06-15T11:00:00Z,30.2`);

      const saveSpy = jest.spyOn(csvUploadRepositoryMock, 'save');

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

      const createSensorReadingSpy = jest
        .spyOn(sensorReadingServiceMock, 'create')
        .mockResolvedValue(createdReading);

      await service['processCsv'](validCsvContent, 'test.csv');

      expect(saveSpy).toHaveBeenCalledTimes(2);
      expect(createSensorReadingSpy).toHaveBeenCalledTimes(2);

      const lastSaveCall = saveSpy.mock.calls[1][0];
      expect(lastSaveCall.status).toBe(CsvUploadStatus.PROCESSED);
    });

    it('should handle partial failures in CSV processing', async () => {
      const mixedCsv = Buffer.from(`equipmentId,timestamp,value
      EQUIP001,2023-06-15T10:00:00Z,25.5
      INVALID_ROW,invalid-timestamp,30.2
      EQUIP003,2023-06-15T12:00:00Z,35.7`);

      const saveSpy = jest.spyOn(csvUploadRepositoryMock, 'save');

      await service['processCsv'](mixedCsv, 'mixed.csv');

      const lastSaveCall = saveSpy.mock.calls[1][0];

      expect(lastSaveCall.status).toBe(CsvUploadStatus.PROCESSED_WITH_ERRORS);
    });
  });
});
