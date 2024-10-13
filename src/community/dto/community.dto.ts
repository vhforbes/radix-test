import { ApiProperty } from '@nestjs/swagger';
import { UnsensitiveUserDto } from '@src/user/dtos/unsensitive-user.dto';
import { IsUUID } from 'class-validator';
import { CommunityStatus } from '../community-status.enum.dto';

export class CommunityDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: CommunityStatus })
  status: CommunityStatus;

  @ApiProperty()
  monthly_price: number;

  @ApiProperty()
  yearly_price: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  max_traders: number;

  @ApiProperty()
  max_vips: number;

  @ApiProperty({ nullable: true })
  description: string;

  @ApiProperty()
  owner: UnsensitiveUserDto;
}
