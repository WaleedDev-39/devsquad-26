import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatSessionDocument = ChatSession & Document;

export class ChatMessage {
  @Prop({ required: true })
  role: 'user' | 'assistant';

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

@Schema({ timestamps: true })
export class ChatSession {
  @Prop({ required: true, unique: true })
  sessionId: string;

  @Prop([{ role: String, content: String, timestamp: Date }])
  messages: ChatMessage[];
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
