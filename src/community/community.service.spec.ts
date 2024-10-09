import { Test, TestingModule } from '@nestjs/testing';
import { CommunityService } from './community.service';
import { communityRepositoryMock } from '@test/mocks/community/community.repository.mock';
import { userServiceMock } from '@test/mocks/user/user.service.mock';

describe('CommunityService', () => {
  let service: CommunityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityService, communityRepositoryMock, userServiceMock],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
