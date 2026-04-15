import { NotificationService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationService);
    getForUser(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, {}> & import("../schemas/notification.schema").Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    markAsRead(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, {}> & import("../schemas/notification.schema").Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
