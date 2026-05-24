import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { CricketService } from './cricket.service';
import { SeedService } from '../seed/seed.service';

export class AskDto {
  question: string;
}

@Controller()
export class CricketController {
  constructor(
    private readonly cricketService: CricketService,
    private readonly seedService: SeedService,
  ) {}

  @Get()
  healthCheck() {
    return { status: 'ok', message: '🏏 Cricket Data Agent API is running' };
  }

  @Post('ask')
  @HttpCode(HttpStatus.OK)
  async ask(@Body() body: AskDto) {
    if (!body?.question?.trim()) {
      return { answer: 'Please provide a question.', type: 'text' };
    }
    const result = await this.cricketService.ask(body.question.trim());
    return result;
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  async upload() {
    try {
      const result = await this.seedService.seed();
      return { success: true, message: result };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  }
}
