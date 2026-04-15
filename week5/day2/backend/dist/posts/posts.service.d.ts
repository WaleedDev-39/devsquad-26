import { Model, Types } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { NotificationService } from '../notifications/notifications.service';
export declare class PostsService {
    private postModel;
    private readonly notificationsService;
    constructor(postModel: Model<Post>, notificationsService: NotificationService);
    create(createPostDto: CreatePostDto, authorId: string): Promise<Omit<import("mongoose").Document<unknown, {}, Post, {}, {}> & Post & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, never>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Post, {}, {}> & Post & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Post, {}, {}> & Post & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    likePost(postId: string, userId: string): Promise<{
        liked: boolean;
        count: number;
    }>;
    incrementCommentCount(postId: string): Promise<import("mongoose").Document<unknown, {}, Post, {}, {}> & Post & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    decrementCommentCount(postId: string): Promise<import("mongoose").Document<unknown, {}, Post, {}, {}> & Post & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
