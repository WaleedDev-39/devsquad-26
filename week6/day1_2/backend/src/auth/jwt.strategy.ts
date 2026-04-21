import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    console.log('JwtStrategy initializing with secret present:', !!secret);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    if (!secret) {
      console.warn('JwtStrategy: JWT_SECRET is not defined in ConfigService!');
    }
  }

  async validate(payload: any) {
    console.log('JwtStrategy validating payload sub:', payload?.sub);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
