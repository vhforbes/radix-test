import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Community from './community.entity';
import { MembershipModule } from '@src/membership/membership.module';

@Module({
  imports: [TypeOrmModule.forFeature([Community]), MembershipModule],
  providers: [CommunityService],
  controllers: [CommunityController],
})
export class CommunityModule {}
