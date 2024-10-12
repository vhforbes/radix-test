import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import User from '@src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ResetPassDto } from './dtos/reset-password.dto';
import { hashPassword } from '@src/utils/hash-password';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private logger: Logger,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne(username);

    try {
      const authorized = await bcrypt.compare(password, user.password);

      if (authorized) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error('Error comparing passwords', error.message);
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
      this.logger.warn('User not found trying to recover', email);
      return;
    }

    const token = await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('JWT_RECOVER_SECRET'),
        expiresIn: '30m',
      },
    );

    // TODO: Call here messaging service where it sends the token to the user
    return token;
  }

  async resetPassword({ newPassword, token }: ResetPassDto): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_RECOVER_SECRET'),
      });

      console.log(decoded);

      const hashedPass = await hashPassword(newPassword);

      this.usersService.updatePassword(decoded.email, hashedPass);

      return decoded;
    } catch (err) {
      this.logger.error(
        'Invalid or expired token when resetting password',
        err,
      );
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
