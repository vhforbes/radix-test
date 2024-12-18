import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Mocking this so i dont need to have all the authService providers aswell
const authServiceMock = {
  provide: AuthService,
  useValue: {
    login: jest.fn(),
  },
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login the user sucessfully', async () => {
    authServiceMock.useValue.login.mockResolvedValue({
      access_token: 'validToken',
    });

    const result = await controller.login(
      {},
      {
        username: 'test@email.com',
        password: '12345',
      },
    );
    expect(result).toEqual({ access_token: 'validToken' });
  });

  it('should return 401 if not authorized', async () => {
    const unauthorizedRes = {
      message: 'Unauthorized',
      statusCode: 401,
    };

    authServiceMock.useValue.login.mockResolvedValue(unauthorizedRes);

    const result = await controller.login(
      {},
      {
        username: 'test@email.com',
        password: '12345',
      },
    );
    expect(result).toEqual(unauthorizedRes);
  });
});
