import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { AuthService } from '../auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID || 'dummy',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || 'dummy',
      callbackURL: process.env.API_URL 
        ? `${process.env.API_URL}/api/auth/discord/callback` 
        : 'http://localhost:5000/api/auth/discord/callback',
      scope: ['identify', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { id, username, email, avatar } = profile;
    
    // Discord avatar URL formatting
    const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : null;

    const userProfile = {
      provider: 'discord',
      providerId: id,
      email: email,
      name: username,
      avatar: avatarUrl,
    };

    const { user } = await this.authService.validateOAuthLogin(userProfile);
    done(null, user);
  }
}
