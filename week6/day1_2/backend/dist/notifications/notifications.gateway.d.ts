import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(client: Socket, data: {
        userId?: string;
    }): {
        event: string;
        data: string;
    };
    broadcastSaleNotification(payload: {
        productId: string;
        productName: string;
        salePercent: number;
    }): void;
    sendUserNotification(userId: string, event: string, data: any): void;
}
