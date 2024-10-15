import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from './membership.service';
import { Membership } from './membership.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@test/mocks/repositoryMockFactory';
import { MembershipRole } from './enums/membership-roles.enum';

describe('MembershipService', () => {
  let service: MembershipService;
  const membershipRepositoryMock = {
    provide: getRepositoryToken(Membership),
    useValue: repositoryMockFactory(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipService, membershipRepositoryMock],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user - community membership with desired role', async () => {
    const newMembership = {
      id: 'uuid',
      user: {
        id: 'valid_user_id',
      },
      community: {
        id: 'valid_community_id',
      },
      role: MembershipRole.OWNER,
    };

    membershipRepositoryMock.useValue.create.mockReturnValue(newMembership);

    const result = await service.assignMembershipRole(
      'valid_user_id',
      'valid_community_id',
      MembershipRole.OWNER,
    );

    expect(result).toEqual(newMembership);
  });

  it('should return true if user has membership required', async () => {
    membershipRepositoryMock.useValue.findOne.mockReturnValue({
      id: 'uuid',
      user: {
        id: 'valid_user_id',
        email: 'valid_email@email.com',
      },
      community: {
        id: 'valid_community_id',
      },
      role: MembershipRole.OWNER,
    });

    const result = await service.hasMembershipRole(
      'valid_community_id',
      'valid_email@email.com',
      [MembershipRole.OWNER],
    );

    expect(result).toBeTruthy();
  });

  it('should return false if user dont have membership required', async () => {
    membershipRepositoryMock.useValue.findOne.mockReturnValue(null);

    const result = await service.hasMembershipRole(
      'valid_community_id',
      'valid_email@email.com',
      [MembershipRole.OWNER],
    );

    expect(result).toBeFalsy();
  });
});
