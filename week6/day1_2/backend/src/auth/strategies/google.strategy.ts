import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('API_URL') 
        ? `${configService.get<string>('API_URL').replace(/\/api$/, '')}/api/auth/google/callback` 
        : 'http://localhost:5000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });

    console.log('GoogleStrategy initialized with Client ID:', configService.get<string>('GOOGLE_CLIENT_ID')?.substring(0, 10) + '...');
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

    const result = await this.authService.validateOAuthLogin(userProfile);
    done(null, result);
  }
}
