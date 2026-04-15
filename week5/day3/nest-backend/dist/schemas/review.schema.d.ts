import { Document, Types } from 'mongoose';
export type ReviewDocument = Review & Document;
declare class Reply {
    userId: Types.ObjectId;
    userName: String;
    comment: String;
    createdAt: Date;
}
export declare class Review {
    productId: Types.ObjectId;
    userId: Types.ObjectId;
    userName: String;
    rating: number;
    comment: String;
    likes: Types.ObjectId[];
    replies: Reply[];
}
export declare const ReviewSchema: import("mongoose").Schema<Review, import("mongoose").Model<Review, any, any, any, Document<unknown, any, Review, any, {}> & Review & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, import("mongoose").FlatRecord<Review>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Review> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
