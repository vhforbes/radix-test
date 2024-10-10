import { IsJWT, IsStrongPassword } from 'class-validator';

export class ResetPassDto {
  @IsStrongPassword()
  newPassword: string;

  @IsJWT()
  token: string;
}
