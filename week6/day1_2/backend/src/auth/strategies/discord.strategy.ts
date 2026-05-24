import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('DISCORD_CLIENT_ID'),
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET'),
      callbackURL: configService.get<string>('API_URL') 
        ? `${configService.get<string>('API_URL').replace(/\/api$/, '')}/api/auth/discord/callback` 
        : 'http://localhost:5000/api/auth/discord/callback',
      scope: ['identify', 'email'],
    });

    console.log('DiscordStrategy initialized with Client ID:', configService.get<string>('DISCORD_CLIENT_ID')?.substring(0, 10) + '...');
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

    const result = await this.authService.validateOAuthLogin(userProfile);
    done(null, result);
  }
}
