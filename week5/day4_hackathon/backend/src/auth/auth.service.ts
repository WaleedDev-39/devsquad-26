import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingEmail = await this.userModel.findOne({ email: registerDto.email });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUsername = await this.userModel.findOne({ username: registerDto.username });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userModel.create({
      ...registerDto,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ sub: user._id, email: user.email });

    return {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        mobileNumber: user.mobileNumber,
        avatar: user.avatar,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user._id, email: user.email });

    return {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        mobileNumber: user.mobileNumber,
        avatar: user.avatar,
      },
      token,
    };
  }

  async checkUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    return { available: !user };
  }
}
