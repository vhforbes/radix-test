import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// Only what the owner can change!
export class UpdateCommunityDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty({ nullable: true })
  description?: string;
}
