import { Model, Types } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { NotificationGateway } from '../gateway/notification.gateway';
export declare class NotificationService {
    private notificationModel;
    private readonly gateway;
    constructor(notificationModel: Model<Notification>, gateway: NotificationGateway);
    create(data: {
        recipient: string;
        sender: string;
        type: string;
        postId?: string;
        commentId?: string;
    }): Promise<Omit<import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, never>>;
    getForUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    markAsRead(notificationId: string): Promise<import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    broadcastNewComment(comment: any): Promise<void>;
}
