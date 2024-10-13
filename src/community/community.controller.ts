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
import { Roles } from '@src/auth/roles.decorator';
import { UserRole } from '@src/user/user-roles.enum';
import { RolesGuard } from '@src/auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';

@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly reflector: Reflector, // Instantiating for RolesGuard
  ) {}

  // TODO: Guarantee only authorized user or superAdmin can create
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

  // TODO: Guarantee the owner or admin or superAdmin
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    return this.communityService.update(id, updateCommunityDto);
  }

  // TODO: Guarantee the owner or admin or superAdmin
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communityService.remove(id);
  }
}
