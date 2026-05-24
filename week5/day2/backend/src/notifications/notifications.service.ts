import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { NotificationGateway } from '../gateway/notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private readonly gateway: NotificationGateway,
  ) {}

  async create(data: {
    recipient: string;
    sender: string;
    type: string;
    postId?: string;
    commentId?: string;
  }) {
    const notification = new this.notificationModel({
      recipient: new Types.ObjectId(data.recipient),
      sender: new Types.ObjectId(data.sender),
      type: data.type,
      postId: data.postId ? new Types.ObjectId(data.postId) : null,
      commentId: data.commentId ? new Types.ObjectId(data.commentId) : null,
    });

    const savedNotification = await (await notification.save())
      .populate('sender', 'username profilePic');

    // Emit real-time notification
    this.gateway.sendToUser(data.recipient, 'notification', savedNotification);

    return savedNotification;
  }

  async getForUser(userId: string) {
    return this.notificationModel
      .find({ recipient: new Types.ObjectId(userId) })
      .populate('sender', 'username profilePic')
      .sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(notificationId, { read: true }, { new: true });
  }

  async broadcastNewComment(comment: any) {
    this.gateway.broadcast('new-comment', comment);
  }
}
