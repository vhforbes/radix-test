import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@src/user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const userMock = {
    id: 'uuid',
    name: 'User Name',
    email: 'vhforbes@gmail.com',
    password: '170496',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const userServiceMock = {
    provide: UserService,
    useValue: {
      findOne: jest.fn(),
    },
  };

  const jwtServiceMock = {
    provide: JwtService,
    useValue: {
      signAsync: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, userServiceMock, jwtServiceMock],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate the user password and return the user', async () => {
    userServiceMock.useValue.findOne.mockResolvedValue(userMock);

    const result = await service.validateUser(
      userMock.email,
      userMock.password,
    );

    expect(result).toEqual(userMock);
  });

  it('should return null if the password or email is incorrect', async () => {
    userServiceMock.useValue.findOne.mockResolvedValue(userMock);

    const result = await service.validateUser('wrong@email.com', 'wrongpass');

    expect(result).toBeNull();
  });

  it('should return the user access_token', async () => {
    jwtServiceMock.useValue.signAsync.mockResolvedValue('valid_jwt');

    const result = await service.login(userMock);

    console.log(result);

    expect(result).toEqual({
      access_token: 'valid_jwt',
    });
  });
});
