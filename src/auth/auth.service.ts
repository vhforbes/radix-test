import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import User from '@src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ResetPassDto } from './auth.validator';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    try {
      const authorized = await bcrypt.compare(password, user.password);

      if (authorized) {
        console.log(user);

        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async login(user: Partial<User>): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload = { email: user.email, name: user.name, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15d',
      }),

      refresh_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };
  }

  async recoverPassword(email: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      console.error(`User ${email} requesting password change don't exist`);
      return 'TO BE IMPLEMENTED no user';
    }

    const token = await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '30m',
      },
    );

    // TODO: Call here service where it sends the token to the user
    return token;
  }

  async resetPassword({ newPassword, token }: ResetPassDto): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // TODO: Hash and save user password

      console.log(newPassword);

      console.log('Token is valid:', decoded);

      return decoded;
    } catch (err) {
      console.error('Invalid or expired token', err);
      return null;
    }
  }
}
