import { MembershipService } from '@src/membership/membership.service';

export const membershipServiceMock = {
  provide: MembershipService,
  useValue: {
    assignMemberRole: jest.fn(),
    hasMembershipRole: jest.fn(),
  },
};
