"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("../schemas/review.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let ReviewsService = class ReviewsService {
    constructor(reviewModel, notificationsService) {
        this.reviewModel = reviewModel;
        this.notificationsService = notificationsService;
    }
    async createReview(productId, userId, userName, rating, comment) {
        const review = new this.reviewModel({
            productId: new mongoose_2.Types.ObjectId(productId),
            userId: new mongoose_2.Types.ObjectId(userId),
            userName,
            rating,
            comment,
        });
        const savedReview = await review.save();
        await this.notificationsService.create(new mongoose_2.Types.ObjectId(userId), userName, 'BROADCAST', `New review added for product by ${userName}`, { productId, reviewId: savedReview._id });
        return savedReview;
    }
    async addReply(reviewId, userId, userName, comment) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        review.replies.push({
            userId: new mongoose_2.Types.ObjectId(userId),
            userName,
            comment,
            createdAt: new Date(),
        });
        await review.save();
        if (review.userId.toString() !== userId) {
            await this.notificationsService.create(review.userId, userName, 'DIRECT', `${userName} replied to your review: "${comment.substring(0, 50)}..."`, { reviewId, replyUserId: userId });
        }
        return review;
    }
    async getReviewsByProduct(productId) {
        return this.reviewModel.find({ productId: new mongoose_2.Types.ObjectId(productId) }).sort({ createdAt: -1 });
    }
    async toggleLike(reviewId, userId, userName) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const userIdObj = new mongoose_2.Types.ObjectId(userId);
        const index = review.likes.findIndex(id => id.equals(userIdObj));
        if (index === -1) {
            review.likes.push(userIdObj);
            if (review.userId.toString() !== userId) {
                await this.notificationsService.create(review.userId, userName, 'LIKE', `${userName} liked your review!`, { reviewId });
            }
        }
        else {
            review.likes.splice(index, 1);
        }
        return review.save();
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_service_1.NotificationsService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map