import { Logger } from '@nestjs/common';

export const loggerMock = {
  provide: Logger,
  useValue: {
    log: jest.fn(),
    error: jest.fn(),
  },
};
