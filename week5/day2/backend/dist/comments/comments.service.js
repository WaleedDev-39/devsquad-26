"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("../schemas/comment.schema");
const posts_service_1 = require("../posts/posts.service");
const notifications_service_1 = require("../notifications/notifications.service");
let CommentsService = class CommentsService {
    constructor(commentModel, postsService, notificationsService) {
        this.commentModel = commentModel;
        this.postsService = postsService;
        this.notificationsService = notificationsService;
    }
    async create(createCommentDto, authorId) {
        const { content, postId, parentId } = createCommentDto;
        const comment = new this.commentModel({
            content,
            postId: new mongoose_2.Types.ObjectId(postId),
            author: new mongoose_2.Types.ObjectId(authorId),
            parentId: parentId ? new mongoose_2.Types.ObjectId(parentId) : null,
        });
        const savedComment = await (await comment.save()).populate('author', 'username profilePic');
        const post = await this.postsService.incrementCommentCount(postId);
        if (parentId) {
            const parentComment = await this.commentModel.findById(parentId);
            if (parentComment && parentComment.author.toString() !== authorId) {
                await this.notificationsService.create({
                    recipient: parentComment.author.toString(),
                    sender: authorId,
                    type: 'COMMENT_REPLY',
                    postId,
                    commentId: savedComment._id.toString(),
                });
            }
        }
        else {
            if (post && post.author.toString() !== authorId) {
                await this.notificationsService.create({
                    recipient: post.author.toString(),
                    sender: authorId,
                    type: 'POST_COMMENT',
                    postId,
                    commentId: savedComment._id.toString(),
                });
            }
        }
        this.notificationsService.broadcastNewComment(savedComment);
        return savedComment;
    }
    async findByPostId(postId) {
        return this.commentModel.find({ postId: new mongoose_2.Types.ObjectId(postId) })
            .populate('author', 'username profilePic')
            .sort({ createdAt: 1 });
    }
    async likeComment(commentId, userId) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const hasLiked = comment.likes.some(id => id.equals(userObjectId));
        if (hasLiked) {
            comment.likes = comment.likes.filter(id => !id.equals(userObjectId));
        }
        else {
            comment.likes.push(userObjectId);
            if (comment.author.toString() !== userId) {
                await this.notificationsService.create({
                    recipient: comment.author.toString(),
                    sender: userId,
                    type: 'COMMENT_LIKE',
                    postId: comment.postId.toString(),
                    commentId: comment._id.toString(),
                });
            }
        }
        await comment.save();
        return { liked: !hasLiked, count: comment.likes.length };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        posts_service_1.PostsService,
        notifications_service_1.NotificationService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map