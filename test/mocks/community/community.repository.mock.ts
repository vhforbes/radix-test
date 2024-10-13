import { getRepositoryToken } from '@nestjs/typeorm';
import Community from '@src/community/community.entity';

export const communityRepositoryMock = {
  provide: getRepositoryToken(Community),
  useValue: {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  },
};
