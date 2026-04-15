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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let UsersService = class UsersService {
    constructor(userModel, notificationsService) {
        this.userModel = userModel;
        this.notificationsService = notificationsService;
    }
    async findByUsername(username) {
        const user = await this.userModel.findOne({ username }).select('-password').populate('followers following', 'username profilePic');
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findById(id) {
        return this.userModel.findById(id).select('-password');
    }
    async followUser(userId, targetId) {
        if (userId.toString() === targetId.toString()) {
            throw new common_1.BadRequestException('You cannot follow yourself');
        }
        const targetUser = await this.userModel.findById(targetId);
        if (!targetUser) {
            throw new common_1.NotFoundException('Target user not found');
        }
        const user = await this.userModel.findById(userId);
        const isFollowing = user.following.some(id => id.toString() === targetId);
        if (isFollowing) {
            await this.userModel.findByIdAndUpdate(userId, { $pull: { following: targetId } });
            await this.userModel.findByIdAndUpdate(targetId, { $pull: { followers: userId } });
        }
        else {
            await this.userModel.findByIdAndUpdate(userId, { $addToSet: { following: targetId } });
            await this.userModel.findByIdAndUpdate(targetId, { $addToSet: { followers: userId } });
            await this.notificationsService.create({
                recipient: targetId,
                sender: userId,
                type: 'FOLLOW',
            });
        }
        return { following: !isFollowing };
    }
    async updateProfile(userId, data) {
        return this.userModel.findByIdAndUpdate(userId, data, { new: true }).select('-password');
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_service_1.NotificationService])
], UsersService);
//# sourceMappingURL=users.service.js.map