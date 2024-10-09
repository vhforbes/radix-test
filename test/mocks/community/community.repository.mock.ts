import { getRepositoryToken } from '@nestjs/typeorm';
import Community from '@src/community/community.entity';

export const communityRepositoryMock = {
  provide: getRepositoryToken(Community),
  useValue: {
    findOneBy: jest.fn(),
  },
};
