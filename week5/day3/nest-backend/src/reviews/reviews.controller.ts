import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(
    @Body('productId') productId: string,
    @Body('userId') userId: string,
    @Body('userName') userName: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
  ) {
    return this.reviewsService.createReview(productId, userId, userName, rating, comment);
  }

  @Post(':id/replies')
  async addReply(
    @Param('id') reviewId: string,
    @Body('userId') userId: string,
    @Body('userName') userName: string,
    @Body('comment') comment: string,
  ) {
    return this.reviewsService.addReply(reviewId, userId, userName, comment);
  }

  @Get('product/:productId')
  async getReviews(@Param('productId') productId: string) {
    return this.reviewsService.getReviewsByProduct(productId);
  }

  @Patch(':id/like')
  async toggleLike(
    @Param('id') reviewId: string,
    @Body('userId') userId: string,
    @Body('userName') userName: string,
  ) {
    return this.reviewsService.toggleLike(reviewId, userId, userName);
  }
}
