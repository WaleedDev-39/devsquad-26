import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Car, CarDocument } from '../schemas/car.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
  ) {}

  async toggleWishlist(userId: string, carId: string) {
    const user = await this.userModel.findById(userId);
    const index = user.wishlist.findIndex((id) => id.toString() === carId);

    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();
      return { added: false, message: 'Removed from wishlist' };
    } else {
      user.wishlist.push(carId as any);
      await user.save();
      return { added: true, message: 'Added to wishlist' };
    }
  }

  async getWishlist(userId: string) {
    const user = await this.userModel.findById(userId).populate({
      path: 'wishlist',
      populate: { path: 'seller', select: 'fullName username avatar' },
    });
    return user.wishlist;
  }

  async checkWishlist(userId: string, carId: string) {
    const user = await this.userModel.findById(userId);
    const isInWishlist = user.wishlist.some((id) => id.toString() === carId);
    return { isInWishlist };
  }
}
