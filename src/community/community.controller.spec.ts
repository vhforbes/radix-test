import { Test, TestingModule } from '@nestjs/testing';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { userServiceMock } from '@test/mocks/user/user.service.mock';
import { communityRepositoryMock } from '@test/mocks/community/community.repository.mock';
import { membershipServiceMock } from '@test/mocks/membership/membership.service.mock';

describe('CommunityController', () => {
  let controller: CommunityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityController],
      providers: [
        CommunityService,
        communityRepositoryMock,
        userServiceMock,
        membershipServiceMock,
      ],
    }).compile();

    controller = module.get<CommunityController>(CommunityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
