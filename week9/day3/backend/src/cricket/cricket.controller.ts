import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CricketService } from './cricket.service';

export class AskDto {
  userId: string;
  chatId: string;
  question: string;
}

@Controller()
export class CricketController {
  constructor(private readonly cricketService: CricketService) {}

  @Get()
  healthCheck() {
    return {
      status: 'ok',
      message: '🏏 Cricket Chatbot with Memory API is running',
      endpoints: [
        'POST /ask',
        'GET  /history/:chatId',
        'GET  /summary/:chatId',
        'DELETE /history/:chatId',
        'GET  /sessions/:userId',
      ],
    };
  }

  /**
   * POST /ask
   * Body: { userId: string, chatId: string, question: string }
   * Returns: { answer: string, type: 'text'|'table', memoryTrace: string[] }
   */
  @Post('ask')
  @HttpCode(HttpStatus.OK)
  async ask(@Body() body: AskDto) {
    if (!body?.question?.trim()) {
      return { answer: 'Please provide a question.', type: 'text', memoryTrace: [] };
    }
    if (!body?.userId?.trim()) {
      return { answer: 'Please provide a userId.', type: 'text', memoryTrace: [] };
    }
    if (!body?.chatId?.trim()) {
      return { answer: 'Please provide a chatId.', type: 'text', memoryTrace: [] };
    }

    const result = await this.cricketService.ask(
      body.userId.trim(),
      body.chatId.trim(),
      body.question.trim(),
    );
    return result;
  }

  /**
   * GET /history/:chatId
   * Returns: ConversationTurn[]
   */
  @Get('history/:chatId')
  async getHistory(@Param('chatId') chatId: string) {
    const history = await this.cricketService.getHistory(chatId);
    return { chatId, history, count: history.length };
  }

  /**
   * GET /summary/:chatId
   * Returns: { chatId, summary: string | null }
   */
  @Get('summary/:chatId')
  async getSummary(@Param('chatId') chatId: string) {
    const result = await this.cricketService.getSummary(chatId);
    return { chatId, ...result };
  }

  /**
   * DELETE /history/:chatId
   * Clears all conversations + summary for the specific chat session
   */
  @Delete('history/:chatId')
  async clearHistory(@Param('chatId') chatId: string) {
    const result = await this.cricketService.clearHistory(chatId);
    return {
      success: true,
      message: `Memory cleared for chat session ${chatId}`,
      ...result,
    };
  }

  /**
   * GET /sessions/:userId
   * Returns all previous chat sessions for a given user
   */
  @Get('sessions/:userId')
  async getSessions(@Param('userId') userId: string) {
    const sessions = await this.cricketService.getSessions(userId);
    return { userId, sessions };
  }
}
