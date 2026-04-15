import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: any): Promise<Omit<import("mongoose").Document<unknown, {}, import("../schemas/post.schema").Post, {}, {}> & import("../schemas/post.schema").Post & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/post.schema").Post, {}, {}> & import("../schemas/post.schema").Post & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/post.schema").Post, {}, {}> & import("../schemas/post.schema").Post & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    likePost(id: string, req: any): Promise<{
        liked: boolean;
        count: number;
    }>;
}
