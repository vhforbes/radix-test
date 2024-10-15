import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@src/common/roles.decorator';
import { UserRole } from '@src/user/user-roles.enum';
import { RolesGuard } from '@src/auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { MembershipRoleGuard } from '@src/membership/guards/membership.guard';
import { MembershipRole } from '@src/membership/enums/membership-roles.enum';

@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly reflector: Reflector, // Instantiating for RolesGuard
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  @Post()
  create(@Request() req, @Body() createCommunityDto: CreateCommunityDto) {
    return this.communityService.create(req.user, createCommunityDto);
  }

  @Get()
  findAll() {
    return this.communityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communityService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, MembershipRoleGuard)
  @Roles([MembershipRole.OWNER, MembershipRole.ADMIN])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    return this.communityService.update(id, updateCommunityDto);
  }

  @UseGuards(JwtAuthGuard, MembershipRoleGuard)
  @Roles([MembershipRole.OWNER])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityService.remove(id);
  }
}
