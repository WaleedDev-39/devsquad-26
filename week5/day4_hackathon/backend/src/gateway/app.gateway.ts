import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  afterInit(server: Server) {
    console.log('🔌 WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join:auction')
  handleJoinAuction(@ConnectedSocket() client: Socket, @MessageBody() data: { carId: string }) {
    client.join(`auction:${data.carId}`);
    console.log(`Client ${client.id} joined auction:${data.carId}`);
  }

  @SubscribeMessage('leave:auction')
  handleLeaveAuction(@ConnectedSocket() client: Socket, @MessageBody() data: { carId: string }) {
    client.leave(`auction:${data.carId}`);
    console.log(`Client ${client.id} left auction:${data.carId}`);
  }

  @SubscribeMessage('register:user')
  handleRegisterUser(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
    this.connectedUsers.set(client.id, data.userId);
    client.join(`user:${data.userId}`);
    console.log(`User ${data.userId} registered with socket ${client.id}`);
  }

  // Emit methods called from services
  emitBidUpdate(carId: string, bidData: any) {
    this.server.to(`auction:${carId}`).emit('bid:new', bidData);
    this.server.emit('bid:update', { carId, ...bidData });
  }

  emitAuctionStart(carData: any) {
    this.server.emit('auction:start', carData);
  }

  emitAuctionEnd(carData: any) {
    this.server.emit('auction:end', carData);
  }

  emitAuctionWinner(data: any) {
    this.server.emit('auction:winner', data);
  }

  emitShippingUpdate(carId: string, userId: string, data: any) {
    this.server.to(`user:${userId}`).emit('shipping:update', { carId, ...data });
    this.server.to(`auction:${carId}`).emit('shipping:update', { carId, ...data });
  }

  emitNotification(data: any) {
    this.server.emit('notification', {
      ...data,
      timestamp: new Date(),
    });
  }
}
