import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { UserReq } from '@src/auth/interfaces';
import { UserService } from '@src/user/user.service';
import { IsNull, Repository } from 'typeorm';
import Community from './community.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityDto } from './dto/community.dto';
import { CommunityStatus } from './community-status.enum.dto';
import { MembershipService } from '@src/membership/membership.service';
import { MembershipRole } from '@src/membership/membership-roles.enum';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
    private membershipService: MembershipService,
    private userService: UserService,
  ) {}

  async create(userReq: UserReq, createCommunityDto: CreateCommunityDto) {
    const user = await this.userService.findOne(userReq.email);

    const nameAlreadyExists = await this.communityRepository.findOneBy({
      name: createCommunityDto.name ?? IsNull(),
    });

    if (nameAlreadyExists) {
      throw new ConflictException('Comunity name already exists');
    }

    const community = this.communityRepository.create({
      name: createCommunityDto.name,
      owner: user,
      monthly_price: createCommunityDto.monthly_price,
      yearly_price: createCommunityDto.yearly_price,
    });

    await this.communityRepository.save(community);

    await this.membershipService.assignMemberRole(
      community,
      user,
      MembershipRole.OWNER,
    );

    delete community.owner;

    return community;
  }

  async findAll() {
    return await this.communityRepository.find();
  }

  async findOne(id: string) {
    const community = await this.communityRepository.findOne({
      where: {
        id,
      },
      relations: ['owner'],
    });

    if (!community) {
      return null;
    }

    const communityDto: CommunityDto = {
      ...community,
      owner: {
        name: community.owner.name,
      },
    };

    return communityDto;
  }

  async update(id: string, updateCommunityDto: UpdateCommunityDto) {
    const communityToUpdate = await this.findOne(id);

    if (!communityToUpdate) {
      throw new BadRequestException('Community not found');
    }

    await this.communityRepository.update(id, updateCommunityDto);

    return `Community updated`;
  }

  async remove(id: string) {
    const communityToRemove = await this.findOne(id);

    if (!communityToRemove) {
      throw new BadRequestException('Community not found');
    }

    await this.communityRepository.update(id, {
      status: CommunityStatus.INACTIVE,
    });

    return `Community deleted`;
  }
}
