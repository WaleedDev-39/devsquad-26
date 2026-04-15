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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_schema_1 = require("../schemas/post.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let PostsService = class PostsService {
    constructor(postModel, notificationsService) {
        this.postModel = postModel;
        this.notificationsService = notificationsService;
    }
    async create(createPostDto, authorId) {
        const post = new this.postModel({
            ...createPostDto,
            author: new mongoose_2.Types.ObjectId(authorId),
        });
        return (await post.save()).populate('author', 'username profilePic');
    }
    async findAll() {
        return this.postModel.find().populate('author', 'username profilePic').sort({ createdAt: -1 });
    }
    async findOne(id) {
        const post = await this.postModel.findById(id).populate('author', 'username profilePic');
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return post;
    }
    async likePost(postId, userId) {
        const post = await this.postModel.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const hasLiked = post.likes.some(id => id.equals(userObjectId));
        if (hasLiked) {
            post.likes = post.likes.filter(id => !id.equals(userObjectId));
        }
        else {
            post.likes.push(userObjectId);
            if (post.author.toString() !== userId) {
                await this.notificationsService.create({
                    recipient: post.author.toString(),
                    sender: userId,
                    type: 'POST_LIKE',
                    postId: post._id.toString(),
                });
            }
        }
        await post.save();
        return { liked: !hasLiked, count: post.likes.length };
    }
    async incrementCommentCount(postId) {
        return this.postModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    }
    async decrementCommentCount(postId) {
        return this.postModel.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_service_1.NotificationService])
], PostsService);
//# sourceMappingURL=posts.service.js.map