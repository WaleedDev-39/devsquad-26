import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoiceQueryDocument = VoiceQuery & Document;

@Schema({ timestamps: true })
export class VoiceQuery {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  transcript: string;

  @Prop({ required: true, enum: ['voice', 'text'], default: 'text' })
  source: 'voice' | 'text';

  @Prop([String])
  productsReturned: string[];

  @Prop()
  intentDetected: string;
}

export const VoiceQuerySchema = SchemaFactory.createForClass(VoiceQuery);
