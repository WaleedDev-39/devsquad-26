import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/review.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createReview(productId: string, userId: string, userName: string, rating: number, comment: string) {
    const review = new this.reviewModel({
      productId: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId),
      userName,
      rating,
      comment,
    });
    const savedReview = await review.save();

    // Broadcast notification for new review
    await this.notificationsService.create(
      new Types.ObjectId(userId), // Here, userId is sender, but for broadcast it doesn't strictly matter for recipient
      userName,
      'BROADCAST',
      `New review added for product by ${userName}`,
      { productId, reviewId: savedReview._id }
    );

    return savedReview;
  }

  async addReply(reviewId: string, userId: string, userName: string, comment: string) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    review.replies.push({
      userId: new Types.ObjectId(userId),
      userName,
      comment,
      createdAt: new Date(),
    } as any);

    await review.save();

    // Notify review owner (Direct Notification)
    if (review.userId.toString() !== userId) {
      await this.notificationsService.create(
        review.userId,
        userName,
        'DIRECT',
        `${userName} replied to your review: "${comment.substring(0, 50)}..."`,
        { reviewId, replyUserId: userId }
      );
    }

    return review;
  }

  async getReviewsByProduct(productId: string) {
    return this.reviewModel.find({ productId: new Types.ObjectId(productId) }).sort({ createdAt: -1 });
  }

  async toggleLike(reviewId: string, userId: string, userName: string) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    const userIdObj = new Types.ObjectId(userId);
    const index = review.likes.findIndex(id => id.equals(userIdObj));

    if (index === -1) {
      review.likes.push(userIdObj);
      // Notify owner of the like
      if (review.userId.toString() !== userId) {
        await this.notificationsService.create(
          review.userId,
          userName,
          'LIKE',
          `${userName} liked your review!`,
          { reviewId }
        );
      }
    } else {
      review.likes.splice(index, 1);
    }

    return review.save();
  }
}
