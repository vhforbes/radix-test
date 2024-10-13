import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from './membership.service';
import { repositoryMockFactory } from '@test/mocks/repositoryMockFactory';
import { Membership } from './membership.entity';

describe('MembershipService', () => {
  let service: MembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipService, repositoryMockFactory(Membership)],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
