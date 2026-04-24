import { Document, Schema as MongooseSchema, Types } from 'mongoose';
export type ReviewDocument = Review & Document;
export declare class Review {
    productId: Types.ObjectId;
    userId: Types.ObjectId;
    userName: string;
    rating: number;
    comment: string;
    isVerified: boolean;
}
export declare const ReviewSchema: MongooseSchema<Review, import("mongoose").Model<Review, any, any, any, Document<unknown, any, Review, any, {}> & Review & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, import("mongoose").FlatRecord<Review>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Review> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
