import { Controller, Post, Body, Param } from '@nestjs/common';
import { AgentsService } from '../agents/agents.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post(':documentId')
  async handleChat(
    @Param('documentId') documentId: string,
    @Body('message') message: string,
  ) {
    try {
      const response = await this.agentsService.processRequest(documentId, message);
      return { response };
    } catch (error) {
      console.error('Chat Error:', error);
      return { 
        response: `Sorry, I encountered an error: ${error.message}`,
        error: error.message 
      };
    }
  }
}
