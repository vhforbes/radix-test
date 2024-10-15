import { MembershipService } from '@src/membership/membership.service';

export const membershipServiceMock = {
  provide: MembershipService,
  useValue: {
    assignMembershipRole: jest.fn(),
    hasMembershipRole: jest.fn(),
  },
};
