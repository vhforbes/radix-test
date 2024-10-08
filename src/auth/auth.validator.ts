import { IsEmail, IsJWT, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthDto {
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class ResetPassDto {
  @IsStrongPassword()
  newPassword: string;

  @IsJWT()
  token: string;
}
