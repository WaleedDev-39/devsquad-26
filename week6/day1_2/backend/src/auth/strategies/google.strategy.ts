import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
      callbackURL: process.env.API_URL 
        ? `${process.env.API_URL.replace(/\/api$/, '')}/api/auth/google/callback` 
        : 'http://localhost:5000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;
    const userProfile = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName || ''} ${name.familyName || ''}`.trim() || emails[0].value.split('@')[0],
      avatar: photos[0]?.value,
    };

    const { user } = await this.authService.validateOAuthLogin(userProfile);
    done(null, user);
  }
}
