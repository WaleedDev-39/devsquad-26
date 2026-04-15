import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, data: { userId?: string }) {
    if (data?.userId) {
      client.join(`user:${data.userId}`);
    }
    client.join('all');
    return { event: 'joined', data: 'Connected to notifications' };
  }

  // Broadcast sale notification to all connected users
  broadcastSaleNotification(payload: { productId: string; productName: string; salePercent: number }) {
    this.server.to('all').emit('sale-started', {
      message: `🔥 ${payload.productName} is now ${payload.salePercent}% OFF!`,
      ...payload,
      timestamp: new Date(),
    });
  }

  // Send targeted notification to specific user
  sendUserNotification(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
