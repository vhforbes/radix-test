import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentService } from './equipment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Equipment } from './equipment.entity';
import { CreateEquipmentDto } from './dtos/create-equipment.dto';

describe('EquipmentService', () => {
  let service: EquipmentService;

  const mockEquipment = {
    equipmentId: '123',
    name: 'Test Equipment',
    type: 'Test Type',
  };

  const mockEquipmentRepository = {
    create: jest.fn().mockImplementation((dto: CreateEquipmentDto) => ({
      ...dto,
      equipmentId: '123',
    })),
    save: jest.fn().mockResolvedValue(mockEquipment),
    find: jest.fn().mockResolvedValue([mockEquipment]),
    findOne: jest.fn().mockResolvedValue(mockEquipment),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipmentService,
        {
          provide: getRepositoryToken(Equipment),
          useValue: mockEquipmentRepository,
        },
      ],
    }).compile();

    service = module.get<EquipmentService>(EquipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new equipment', async () => {
      const dto: CreateEquipmentDto = {
        equipmentId: 'EQID',
        name: 'Test Equipment',
      };
      const result = await service.create(dto);

      expect(mockEquipmentRepository.create).toHaveBeenCalledWith(dto);
      expect(mockEquipmentRepository.save).toHaveBeenCalledWith({
        ...dto,
        equipmentId: '123',
      });
      expect(result).toEqual(mockEquipment);
    });
  });

  describe('findAll', () => {
    it('should return all equipment', async () => {
      const result = await service.findAll();

      expect(mockEquipmentRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockEquipment]);
    });
  });

  describe('findById', () => {
    it('should return a single equipment by ID', async () => {
      const result = await service.findById('123');

      expect(mockEquipmentRepository.findOne).toHaveBeenCalledWith({
        where: { equipmentId: '123' },
      });
      expect(result).toEqual(mockEquipment);
    });

    it('should return null if no equipment is found', async () => {
      mockEquipmentRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.findById('non-existent-id');

      expect(mockEquipmentRepository.findOne).toHaveBeenCalledWith({
        where: { equipmentId: 'non-existent-id' },
      });
      expect(result).toBeNull();
    });
  });
});
