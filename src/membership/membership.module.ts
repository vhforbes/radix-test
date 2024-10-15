import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), UserModule],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
