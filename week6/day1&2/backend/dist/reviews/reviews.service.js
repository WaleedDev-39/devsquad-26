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
const review_schema_1 = require("./schemas/review.schema");
const products_service_1 = require("../products/products.service");
let ReviewsService = class ReviewsService {
    constructor(reviewModel, productsService) {
        this.reviewModel = reviewModel;
        this.productsService = productsService;
    }
    async getProductReviews(productId, page = 1, limit = 6) {
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
    async createReview(userId, productId, data) {
        const review = await this.reviewModel.create({ userId, productId, ...data });
        await this.recalcRating(productId);
        return review;
    }
    async recalcRating(productId) {
        const result = await this.reviewModel.aggregate([
            { $match: { productId: productId } },
            { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        if (result.length) {
            await this.productsService.updateRating(productId, Math.round(result[0].avgRating * 10) / 10, result[0].count);
        }
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map