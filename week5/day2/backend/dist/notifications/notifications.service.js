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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("../schemas/notification.schema");
const notification_gateway_1 = require("../gateway/notification.gateway");
let NotificationService = class NotificationService {
    constructor(notificationModel, gateway) {
        this.notificationModel = notificationModel;
        this.gateway = gateway;
    }
    async create(data) {
        const notification = new this.notificationModel({
            recipient: new mongoose_2.Types.ObjectId(data.recipient),
            sender: new mongoose_2.Types.ObjectId(data.sender),
            type: data.type,
            postId: data.postId ? new mongoose_2.Types.ObjectId(data.postId) : null,
            commentId: data.commentId ? new mongoose_2.Types.ObjectId(data.commentId) : null,
        });
        const savedNotification = await (await notification.save())
            .populate('sender', 'username profilePic');
        this.gateway.sendToUser(data.recipient, 'notification', savedNotification);
        return savedNotification;
    }
    async getForUser(userId) {
        return this.notificationModel
            .find({ recipient: new mongoose_2.Types.ObjectId(userId) })
            .populate('sender', 'username profilePic')
            .sort({ createdAt: -1 });
    }
    async markAsRead(notificationId) {
        return this.notificationModel.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    }
    async broadcastNewComment(comment) {
        this.gateway.broadcast('new-comment', comment);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notification_gateway_1.NotificationGateway])
], NotificationService);
//# sourceMappingURL=notifications.service.js.map