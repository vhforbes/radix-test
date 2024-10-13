import { Test, TestingModule } from '@nestjs/testing';
import { CommunityService } from './community.service';
import { userServiceMock } from '@test/mocks/user/user.service.mock';
import { userMock } from '@test/mocks/user/user.mock';
import { UserReq } from '@src/auth/interfaces';
import { membershipServiceMock } from '@test/mocks/membership/membership.service.mock';
import { repositoryMockFactory } from '@test/mocks/repositoryMockFactory';
import Community from './community.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CommunityService', () => {
  let service: CommunityService;
  let communityRepositoryMock;

  const userReqMock: UserReq = {
    user_id: '123',
    email: 'test@test.com',
    name: 'Name',
    role: 'role',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        // This is not working when trying to mock value on the fn's
        repositoryMockFactory(Community),
        userServiceMock,
        membershipServiceMock,
      ],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
    communityRepositoryMock = module.get(getRepositoryToken(Community));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a community', async () => {
    const communityDto = {
      name: 'Community Name',
      owner: userMock,
      monthly_price: 99,
      yearly_price: 999,
    };

    userServiceMock.useValue.findOne.mockReturnValue(userMock);
    communityRepositoryMock.useValue.findOneBy.mockReturnValue(null);

    communityRepositoryMock.useValue.create.mockReturnValue({
      ...communityDto,
      owner: userMock,
    });

    const result = await service.create(userReqMock, communityDto);

    delete communityDto.owner;

    expect(result).toEqual(communityDto);
  });

  it('Should reject creation if community already exists', async () => {
    const createCommunityDto = {
      name: 'Existing Name',
      owner: userMock,
      monthly_price: 99,
      yearly_price: 999,
    };

    communityRepositoryMock.useValue.findOneBy.mockReturnValue(
      createCommunityDto,
    );

    const createCallToFail = service.create(userReqMock, createCommunityDto);

    await expect(createCallToFail).rejects.toThrow(
      'Comunity name already exists',
    );
  });

  it('Should update a existing comunity', async () => {
    const existingCommunity = {
      name: 'Old Name',
      owner: userMock,
      monthly_price: 99,
      yearly_price: 999,
    };

    communityRepositoryMock.useValue.findOne.mockResolvedValue(
      existingCommunity,
    );

    const updatedCommunityDto = existingCommunity;

    updatedCommunityDto.name = 'Updated Name';

    const result = await service.update('valid-uuid', updatedCommunityDto);

    expect(result).toBe(`Community updated`);
  });

  it('Should throw if community don`t exist', async () => {
    const existingCommunity = null;

    communityRepositoryMock.useValue.findOne.mockResolvedValue(
      existingCommunity,
    );

    const resultToThrow = service.update('invalid-uuid', {});

    await expect(resultToThrow).rejects.toThrow('Community not found');
  });
});
