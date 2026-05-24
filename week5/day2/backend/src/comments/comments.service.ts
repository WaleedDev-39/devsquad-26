import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from '../posts/posts.service';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private postsService: PostsService,
    private readonly notificationsService: NotificationService,
  ) {}

  async create(createCommentDto: CreateCommentDto, authorId: string) {
    const { content, postId, parentId } = createCommentDto;

    const comment = new this.commentModel({
      content,
      postId: new Types.ObjectId(postId),
      author: new Types.ObjectId(authorId),
      parentId: parentId ? new Types.ObjectId(parentId) : null,
    });

    const savedComment = await (await comment.save()).populate('author', 'username profilePic');

    // Increment post comment count
    const post = await this.postsService.incrementCommentCount(postId);

    // Trigger Notification
    if (parentId) {
      // Reply notification
      const parentComment = await this.commentModel.findById(parentId);
      if (parentComment && parentComment.author.toString() !== authorId) {
        await this.notificationsService.create({
          recipient: parentComment.author.toString(),
          sender: authorId,
          type: 'COMMENT_REPLY',
          postId,
          commentId: (savedComment._id as any).toString(),
        });
      }
    } else {
      // Post comment notification
      if (post && post.author.toString() !== authorId) {
        await this.notificationsService.create({
          recipient: post.author.toString(),
          sender: authorId,
          type: 'POST_COMMENT',
          postId,
          commentId: (savedComment._id as any).toString(),
        });
      }
    }

    // Broadcast new comment to all users (for real-time feed update)
    this.notificationsService.broadcastNewComment(savedComment);

    return savedComment;
  }

  async findByPostId(postId: string) {
    return this.commentModel.find({ postId: new Types.ObjectId(postId) })
      .populate('author', 'username profilePic')
      .sort({ createdAt: 1 });
  }

  async likeComment(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const userObjectId = new Types.ObjectId(userId);
    const hasLiked = comment.likes.some(id => id.equals(userObjectId));

    if (hasLiked) {
      comment.likes = comment.likes.filter(id => !id.equals(userObjectId));
    } else {
      comment.likes.push(userObjectId);

      // Trigger notification if the liker is not the author
      if (comment.author.toString() !== userId) {
        await this.notificationsService.create({
          recipient: comment.author.toString(),
          sender: userId,
          type: 'COMMENT_LIKE',
          postId: comment.postId.toString(),
          commentId: (comment._id as any).toString(),
        });
      }
    }

    await comment.save();
    return { liked: !hasLiked, count: comment.likes.length };
  }
}
