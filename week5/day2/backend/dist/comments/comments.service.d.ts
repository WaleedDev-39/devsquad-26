import { Model, Types } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from '../posts/posts.service';
import { NotificationService } from '../notifications/notifications.service';
export declare class CommentsService {
    private commentModel;
    private postsService;
    private readonly notificationsService;
    constructor(commentModel: Model<Comment>, postsService: PostsService, notificationsService: NotificationService);
    create(createCommentDto: CreateCommentDto, authorId: string): Promise<Omit<import("mongoose").Document<unknown, {}, Comment, {}, {}> & Comment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, never>>;
    findByPostId(postId: string): Promise<(import("mongoose").Document<unknown, {}, Comment, {}, {}> & Comment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    likeComment(commentId: string, userId: string): Promise<{
        liked: boolean;
        count: number;
    }>;
}
