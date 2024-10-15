import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Membership } from './membership.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipRole } from './enums/membership-roles.enum';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}

  async assignMembershipRole(
    userId: string,
    communityId: string,
    role: MembershipRole,
  ) {
    const newMembership = this.membershipRepository.create({
      user: { id: userId },
      community: { id: communityId },
      role,
    });

    await this.membershipRepository.save(newMembership);

    return newMembership;
  }

  async hasMembershipRole(communityId: string, email: string, roles: string[]) {
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
