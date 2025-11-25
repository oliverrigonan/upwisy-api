import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
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
  googleCallback(@Req() req, @Res() res) {
    const result = this.authService.googleLogin(req.user);
    const encoded = encodeURIComponent(JSON.stringify(result));

    return res.redirect(
      `http://localhost:4200/auth/google-callback?data=${encoded}`
    );
  }
}
