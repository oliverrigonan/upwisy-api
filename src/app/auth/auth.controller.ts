import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  
  constructor(
    private authService: AuthService
  ) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req) {
    return this.authService.googleLogin(req.user);
  }
}
