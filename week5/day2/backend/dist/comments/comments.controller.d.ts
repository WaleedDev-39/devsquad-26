import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto, req: any): Promise<Omit<import("mongoose").Document<unknown, {}, import("../schemas/comment.schema").Comment, {}, {}> & import("../schemas/comment.schema").Comment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>>;
    findByPostId(postId: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/comment.schema").Comment, {}, {}> & import("../schemas/comment.schema").Comment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    likeComment(id: string, req: any): Promise<{
        liked: boolean;
        count: number;
    }>;
}
