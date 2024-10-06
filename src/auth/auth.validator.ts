import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;
}
