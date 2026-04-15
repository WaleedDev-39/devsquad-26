import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, updateData: any) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: updateData }, { new: true })
      .select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateAddress(userId: string, addressData: any) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: { address: addressData } }, { new: true })
      .select('-password');
    return user;
  }

  async updateTrafficInfo(userId: string, trafficData: any) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: { trafficInfo: trafficData } }, { new: true })
      .select('-password');
    return user;
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(userId, { password: hashed });
    return { message: 'Password updated successfully' };
  }
}
