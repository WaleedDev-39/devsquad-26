import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly notificationsService: NotificationService,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string) {
    const post = new this.postModel({
      ...createPostDto,
      author: new Types.ObjectId(authorId),
    });
    return (await post.save()).populate('author', 'username profilePic');
  }

  async findAll() {
    return this.postModel.find().populate('author', 'username profilePic').sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id).populate('author', 'username profilePic');
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async likePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const userObjectId = new Types.ObjectId(userId);
    const hasLiked = post.likes.some(id => id.equals(userObjectId));

    if (hasLiked) {
      post.likes = post.likes.filter(id => !id.equals(userObjectId));
    } else {
      post.likes.push(userObjectId);
      
      // Trigger notification if the liker is not the author
      if (post.author.toString() !== userId) {
        await this.notificationsService.create({
          recipient: post.author.toString(),
          sender: userId,
          type: 'POST_LIKE',
          postId: (post._id as any).toString(),
        });
      }
    }

    await post.save();
    return { liked: !hasLiked, count: post.likes.length };
  }

  async incrementCommentCount(postId: string) {
    return this.postModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
  }

  async decrementCommentCount(postId: string) {
    return this.postModel.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });
  }
}
