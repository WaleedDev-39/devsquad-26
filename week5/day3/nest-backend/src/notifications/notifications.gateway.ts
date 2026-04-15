import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Injectable } from '@nestjs/common';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
      credentials: true,
    },
  })
  @Injectable()
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
    handleJoinRoom(client: Socket, userId: string) {
      client.join(userId);
      console.log(`User ${userId} joined their notification room.`);
    }
  
    sendDirectNotification(userId: string, data: any) {
      this.server.to(userId).emit('notification', data);
    }
  
    broadcastNotification(data: any) {
      this.server.emit('notification', data);
    }
  }
  
