import { UserService } from '@src/user/user.service';

export const userServiceMock = {
  provide: UserService,
  useValue: {
    findOne: jest.fn(),
  },
};
