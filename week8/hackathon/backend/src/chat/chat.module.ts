import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { AgentsModule } from '../agents/agents.module';

@Module({
  imports: [AgentsModule],
  controllers: [ChatController],
})
export class ChatModule {}
