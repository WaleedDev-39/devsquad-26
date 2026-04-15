import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from '../schemas/notification.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(userId: Types.ObjectId, senderName: string, type: string, message: string, metadata?: any) {
    const notification = new this.notificationModel({
      userId,
      senderName,
      type,
      message,
      metadata,
    });
    
    const savedNotification = await notification.save();

    // Send Real-Time Notification
    if (type === 'BROADCAST') {
      this.notificationsGateway.broadcastNotification(savedNotification);
    } else {
      this.notificationsGateway.sendDirectNotification(userId.toString(), savedNotification);
    }

    return savedNotification;
  }

  async findAllForUser(userId: string) {
    return this.notificationModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(notificationId, { read: true }, { new: true });
  }
}
