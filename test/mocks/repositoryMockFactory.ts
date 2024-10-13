import { getRepositoryToken } from '@nestjs/typeorm';

export const repositoryMockFactory = (entity: any) => ({
  provide: getRepositoryToken(entity),
  useValue: {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
  },
});
