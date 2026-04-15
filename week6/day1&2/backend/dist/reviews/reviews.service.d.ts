import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { ProductsService } from '../products/products.service';
export declare class ReviewsService {
    private reviewModel;
    private productsService;
    constructor(reviewModel: Model<ReviewDocument>, productsService: ProductsService);
    getProductReviews(productId: string, page?: number, limit?: number): Promise<{
        reviews: (import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createReview(userId: string, productId: string, data: {
        rating: number;
        comment: string;
        userName: string;
    }): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private recalcRating;
}
