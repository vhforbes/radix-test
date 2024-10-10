import { ApiProperty } from '@nestjs/swagger';
import { UnsensitiveUserDto } from '@src/user/dtos/unsensitive-user.dto';
import { IsUUID } from 'class-validator';

export class CommunityDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  owner: UnsensitiveUserDto;
}
