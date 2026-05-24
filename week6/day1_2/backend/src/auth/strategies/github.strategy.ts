import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('API_URL') 
        ? `${configService.get<string>('API_URL').replace(/\/api$/, '')}/api/auth/github/callback` 
        : 'http://localhost:5000/api/auth/github/callback',
      scope: ['user:email'],
    });

    console.log('GithubStrategy initialized with Client ID:', configService.get<string>('GITHUB_CLIENT_ID')?.substring(0, 10) + '...');
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { id, displayName, username, emails, photos } = profile;
    const email = emails?.[0]?.value || `${username}@github.com`; 
    
    const userProfile = {
      provider: 'github',
      providerId: id,
      email: email,
      name: displayName || username,
      avatar: photos?.[0]?.value,
    };

    const result = await this.authService.validateOAuthLogin(userProfile);
    done(null, result);
  }
}
