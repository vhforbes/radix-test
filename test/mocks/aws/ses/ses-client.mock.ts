import { SESv2 } from '@aws-sdk/client-sesv2';

export const sesClientMock = {
  provide: SESv2,
  useValue: {
    send: jest.fn(),
  },
};
