import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, updateData: Partial<User>) {
    delete (updateData as any).password;
    delete (updateData as any).role;
    delete (updateData as any).loyaltyPoints;
    const user = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getLoyaltyPoints(userId: string) {
    const user = await this.userModel.findById(userId).select('loyaltyPoints name email');
    if (!user) throw new NotFoundException('User not found');
    return { loyaltyPoints: user.loyaltyPoints };
  }

  async addLoyaltyPoints(userId: string, points: number) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: points } },
      { new: true },
    ).select('-password');
  }

  async deductLoyaltyPoints(userId: string, points: number) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: -points } },
      { new: true },
    ).select('-password');
  }

  async findAll() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 });
  }

  async findOne(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateRole(userId: string, role: string) {
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
