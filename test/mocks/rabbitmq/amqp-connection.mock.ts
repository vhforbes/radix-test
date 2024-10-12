import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export const amqpConnectionMock = {
  provide: AmqpConnection,

  useValue: {
    publish: jest.fn(),
  },
};
