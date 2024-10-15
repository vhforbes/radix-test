import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsUUID } from 'class-validator';
import { AllowedMembershipRoles } from '../enums/allowed-membership-roles.enum';
import { MembershipRole } from '../enums/membership-roles.enum';

export class AssignMembershipDto {
  @ApiProperty()
  @IsUUID()
  communityId: string;

  @ApiProperty()
  @IsEmail()
  userEmail: string;

  @ApiProperty({ enum: AllowedMembershipRoles })
  @IsEnum(AllowedMembershipRoles)
  role: AllowedMembershipRoles | MembershipRole;
}
