import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { UsersService } from './../../users/users.service';

@Injectable()
export class GoogleAuthStrategyService extends PassportStrategy(Strategy, 'google') {

    constructor(
        private readonly usersService: UsersService,
    ) {
        super({
            clientID: process.env.OAUTH_GOOGLE_ID || '',
            clientSecret: process.env.OAUTH_GOOGLE_SECRET || '',
            callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL || '',
            scope: ['email', 'profile'],
            passReqToCallback: false,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<void> {
        try {
            const { id, name, emails, photos } = profile;

            let user = await this.usersService.findOneByGoogleAccountId(id);
            if (!user) {
                user = await this.usersService.create({
                    full_name: name?.familyName && name?.givenName ? `${name.givenName} ${name.familyName}` : '',
                    email: emails?.[0]?.value || '',
                    username: emails?.[0]?.value.split('@')[0] || '',
                    hashed_password: '',
                    type: 'user',
                    is_disabled: false,
                    photo_url: photos?.[0]?.value || '',
                    google_account_id: id,
                    session_id: '',
                });
            }

            done(null, {
                provider: 'google',
                providerId: id,
                email: emails?.[0]?.value ?? null,
                firstName: name?.givenName ?? null,
                lastName: name?.familyName ?? null,
                picture: photos?.[0]?.value ?? null,
                accessToken,
            });
        } catch (err) {
            done(err, false);
        }
    }
}
