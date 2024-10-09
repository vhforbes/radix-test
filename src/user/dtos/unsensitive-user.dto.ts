import { IsString } from 'class-validator';

export class UnsensitiveUserDto {
  @IsString()
  name: string;
}
