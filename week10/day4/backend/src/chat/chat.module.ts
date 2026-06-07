import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSession, ChatSessionSchema } from './schemas/chat-session.schema';
import { VoiceQuery, VoiceQuerySchema } from './schemas/voice-query.schema';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatSession.name, schema: ChatSessionSchema },
      { name: VoiceQuery.name, schema: VoiceQuerySchema },
    ]),
    ProductsModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
