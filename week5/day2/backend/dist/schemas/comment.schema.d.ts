import { Document, Types } from 'mongoose';
export declare class Comment extends Document {
    content: string;
    author: Types.ObjectId;
    postId: Types.ObjectId;
    parentId: Types.ObjectId;
    likes: Types.ObjectId[];
}
export declare const CommentSchema: import("mongoose").Schema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment, any, {}> & Comment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Comment> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
