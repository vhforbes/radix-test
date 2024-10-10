import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { UserReq } from '@src/auth/interfaces';
import { UserService } from '@src/user/user.service';
import { IsNull, Repository } from 'typeorm';
import Community from './community.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityDto } from './dto/community.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
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
      throw new Error('Community not found');
    }

    const communityDto: CommunityDto = {
      ...community,
      owner: {
        name: community.owner.name,
      },
    };

    return communityDto;
  }

  update(id: number, updateCommunityDto: UpdateCommunityDto) {
    return `This action updates a #${id} community ${updateCommunityDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} community`;
  }
}
