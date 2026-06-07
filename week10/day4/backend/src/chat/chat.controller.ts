import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { IsString, IsOptional, IsIn } from 'class-validator';

class SendMessageDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsIn(['voice', 'text'])
  source?: 'voice' | 'text';
}

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('session')
  @ApiOperation({ summary: 'Create a new chat session' })
  async createSession() {
    const sessionId = await this.chatService.createSession();
    return { sessionId };
  }

  @Post('message')
  @ApiOperation({ summary: 'Send a message and get AI response with product suggestions' })
  async sendMessage(@Body() body: SendMessageDto) {
    const sessionId = body.sessionId || (await this.chatService.createSession());
    return this.chatService.sendMessage(sessionId, body.message, body.source || 'text');
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get session history' })
  async getSession(@Param('sessionId') sessionId: string) {
    return this.chatService.getSession(sessionId);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get voice vs text query analytics' })
  async getAnalytics() {
    return this.chatService.getAnalytics();
  }
}
