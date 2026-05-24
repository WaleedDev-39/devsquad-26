import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

interface Comment {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ["http://localhost:3000", "http://localhost:3001", "https://week5-day1-chat-app.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class CommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('CommentsGateway');
  private comments: Comment[] = [];

  @SubscribeMessage('add_comment')
  handleAddComment(client: Socket, payload: { userName: string; text: string }): void {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userName: payload.userName || 'Anonymous',
      text: payload.text,
      timestamp: new Date().toISOString(),
    };
    
    this.comments.push(newComment);
    
    // Broadcast to all connected clients
    this.server.emit('new_comment', newComment);
    this.logger.log(`New comment added by ${newComment.userName}`);
  }

  @SubscribeMessage('get_all_comments')
  handleGetAllComments(client: Socket): void {
    client.emit('all_comments', this.comments);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // Optionally send existing comments on connection
    client.emit('all_comments', this.comments);
  }
}
