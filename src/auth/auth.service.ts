import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import User from '@src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bycript from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    const authorized = bycript.compareSync(password, user.password);

    if (authorized) {
      const { ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  async login(user: User): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload = { email: user.email, name: user.name, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),

      refresh_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
    };
  }
}
