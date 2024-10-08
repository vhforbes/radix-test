import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthDto, ResetPassDto } from './auth.validator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.auth.guard';

@Controller('auth')
export class AuthController {
  // TODO (SECURITY): Save refresh on DB when created and invalidate it when refreshed

  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Request() req, @Body() body: AuthDto) {
    return this.authService.login(req.user);
  }

  // A protected route using JWT Bearer token example
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('recover')
  recoverPassword(@Request() @Body() body: { email: string }) {
    return this.authService.recoverPassword(body.email);
  }

  @Post('reset')
  resetPassword(@Request() @Body() body: ResetPassDto) {
    return this.authService.resetPassword(body);
  }
}
