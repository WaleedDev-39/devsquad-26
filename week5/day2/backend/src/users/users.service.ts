import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly notificationsService: NotificationService,
  ) {}

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username }).select('-password').populate('followers following', 'username profilePic');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password');
  }

  async followUser(userId: string, targetId: string) {
    if (userId.toString() === targetId.toString()) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const targetUser = await this.userModel.findById(targetId);
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    const user = await this.userModel.findById(userId);
    const isFollowing = user.following.some(id => id.toString() === targetId);

    if (isFollowing) {
      // Unfollow
      await this.userModel.findByIdAndUpdate(userId, { $pull: { following: targetId } });
      await this.userModel.findByIdAndUpdate(targetId, { $pull: { followers: userId } });
    } else {
      // Follow
      await this.userModel.findByIdAndUpdate(userId, { $addToSet: { following: targetId } });
      await this.userModel.findByIdAndUpdate(targetId, { $addToSet: { followers: userId } });

      // Trigger notification
      await this.notificationsService.create({
        recipient: targetId,
        sender: userId,
        type: 'FOLLOW',
      });
    }

    return { following: !isFollowing };
  }

  async updateProfile(userId: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(userId, data, { new: true }).select('-password');
  }
}
