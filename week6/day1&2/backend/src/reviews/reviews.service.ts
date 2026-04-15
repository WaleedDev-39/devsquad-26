import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private productsService: ProductsService,
  ) {}

  async getProductReviews(productId: string, page = 1, limit = 6) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name'),
      this.reviewModel.countDocuments({ productId }),
    ]);
    return { reviews, total, page, totalPages: Math.ceil(total / limit) };
  }

  async createReview(userId: string, productId: string, data: { rating: number; comment: string; userName: string }) {
    const review = await this.reviewModel.create({ userId, productId, ...data });
    await this.recalcRating(productId);
    return review;
  }

  private async recalcRating(productId: string) {
    const result = await this.reviewModel.aggregate([
      { $match: { productId: productId } },
      { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (result.length) {
      await this.productsService.updateRating(
        productId,
        Math.round(result[0].avgRating * 10) / 10,
        result[0].count,
      );
    }
  }
}
