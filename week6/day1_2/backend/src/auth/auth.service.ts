import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({ ...dto, password: hashed });

    const token = this.signToken(user);
    return { token, user: this.sanitize(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.signToken(user);
    return { token, user: this.sanitize(user) };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async validateOAuthLogin(profile: any) {
    const { email, name, provider, providerId, avatar } = profile;
    
    // Check if user exists by email
    let user = await this.userModel.findOne({ email: email?.toLowerCase() });

    if (user) {
      // Auto-link account: update provider details if they aren't complete
      if (user.provider === 'local' || !user.providerId) {
        user.provider = provider;
        user.providerId = providerId;
        user.avatar = user.avatar || avatar;
        await user.save();
      }
    } else {
      // Create new user, without a password since it's OAuth
      user = await this.userModel.create({
        email: email.toLowerCase(),
        name,
        provider,
        providerId,
        avatar,
        isActive: true,
      });
    }

    const token = this.signToken(user);
    return { token, user: this.sanitize(user) };
  }

  private signToken(user: UserDocument) {
    return this.jwtService.sign({ 
      sub: user._id.toString(), 
      email: user.email, 
      role: user.role,
      name: user.name,
      avatar: user.avatar || null,
      provider: user.provider || 'local',
    });
  }

  private sanitize(user: UserDocument) {
    const { password, ...rest } = user.toObject();
    return rest;
  }
}
