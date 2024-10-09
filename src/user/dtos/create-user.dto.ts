import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsStrongPassword({ minLength: 8, minUppercase: 1, minSymbols: 1 })
  password: string;
}
