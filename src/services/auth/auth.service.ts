import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginGoogleOauthDto } from './../../dtos/auth/login-google-oauth.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) { }

    googleLogin(user: LoginGoogleOauthDto) {
        if (!user) return { message: 'No user from Google' };

        const payload = { email: user.email, sub: user.providerId };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            user,
            token,
        };
    }
}
