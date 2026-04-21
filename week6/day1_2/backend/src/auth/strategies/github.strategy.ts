import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || 'dummy',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy',
      callbackURL: process.env.API_URL 
        ? `${process.env.API_URL.replace(/\/api$/, '')}/api/auth/github/callback` 
        : 'http://localhost:5000/api/auth/github/callback',
      scope: ['user:email'],
    });
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

    const { user } = await this.authService.validateOAuthLogin(userProfile);
    done(null, user);
  }
}
