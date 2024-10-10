import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UnsensitiveUserDto {
  @ApiProperty()
  @IsString()
  name: string;
}
