import { Test, TestingModule } from '@nestjs/testing';
import { SensorReadingController } from './sensor-reading.controller';
import { SensorReadingService } from './sensor-reading.service';

describe('SensorReadingController', () => {
  let controller: SensorReadingController;
  let service: SensorReadingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorReadingController],
      providers: [
        {
          provide: SensorReadingService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SensorReadingController>(SensorReadingController);
    service = module.get<SensorReadingService>(SensorReadingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the service to create a sensor reading', async () => {
    const dto = {
      equipmentId: 'EQ-12495',
      timestamp: '2023-02-15T01:30:00.000-05:00',
      value: 78.42,
    };

    const expectedResponse = {
      id: 'some-id',
      equipmentId: 'EQ-12495',
      timestamp: new Date('2023-02-15T01:30:00.000-05:00'), // Use Date object
      value: 78.42,
      createdAt: new Date(), // Use Date object
    };

    jest.spyOn(service, 'create').mockResolvedValue(expectedResponse);

    const result = await controller.create(dto);
    expect(result).toEqual(expectedResponse);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
