import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinComunityDto {
  @ApiProperty()
  @IsString()
  communityId: string;

  // Some payment stuff here
}
