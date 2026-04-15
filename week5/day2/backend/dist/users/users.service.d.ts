import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { NotificationService } from '../notifications/notifications.service';
export declare class UsersService {
    private userModel;
    private readonly notificationsService;
    constructor(userModel: Model<User>, notificationsService: NotificationService);
    findByUsername(username: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    followUser(userId: string, targetId: string): Promise<{
        following: boolean;
    }>;
    updateProfile(userId: string, data: Partial<User>): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
