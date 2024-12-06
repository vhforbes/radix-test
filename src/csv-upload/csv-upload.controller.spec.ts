import { Test, TestingModule } from '@nestjs/testing';
import { CsvUploadController } from './csv-upload.controller';
import { CsvUploadService } from './csv-upload.service';

describe('CsvUploadController', () => {
  let controller: CsvUploadController;

  const mockCsvUploadService = {
    processCsv: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsvUploadController],
      providers: [
        {
          provide: CsvUploadService,
          useValue: mockCsvUploadService,
        },
      ],
    }).compile();

    controller = module.get<CsvUploadController>(CsvUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
