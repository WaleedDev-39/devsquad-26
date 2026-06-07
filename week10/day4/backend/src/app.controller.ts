import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return { status: 'ok', service: 'Healthcare Chatbot API', version: '1.0.0' };
  }
}
