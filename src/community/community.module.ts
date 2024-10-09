import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Community from './community.entity';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Community]), UserModule],
  providers: [CommunityService],
  controllers: [CommunityController],
})
export class CommunityModule {}
