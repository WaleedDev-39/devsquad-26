import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(productId: string, userId: string, userName: string, rating: number, comment: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/review.schema").ReviewDocument, {}, {}> & import("../schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addReply(reviewId: string, userId: string, userName: string, comment: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/review.schema").ReviewDocument, {}, {}> & import("../schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getReviews(productId: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/review.schema").ReviewDocument, {}, {}> & import("../schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    toggleLike(reviewId: string, userId: string, userName: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/review.schema").ReviewDocument, {}, {}> & import("../schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
