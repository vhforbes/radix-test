import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Membership } from './membership.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipRole } from './membership-roles.enum';
import Community from '@src/community/community.entity';
import User from '@src/user/user.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}

  async assignMemberRole(
    community: Community,
    user: User,
    role: MembershipRole,
  ) {
    const newMembership = this.membershipRepository.create({
      community,
      role,
      user,
    });

    await this.membershipRepository.save(newMembership);

    return newMembership;
  }

  async hasMembershipRole(communityId, email, roles: string[]) {
    // Check if it has any of the needed roles
    // ['Admin', 'User' ...]

    const membership = await this.membershipRepository.findOne({
      where: {
        role: In(roles),
        user: {
          email: email,
        },
        community: {
          id: communityId,
        },
      },
      relations: [],
    });

    return !!membership;
  }
}
