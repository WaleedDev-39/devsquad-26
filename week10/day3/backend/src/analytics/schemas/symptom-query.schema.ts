import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SymptomQueryDocument = SymptomQuery & Document;

@Schema({ timestamps: true })
export class SymptomQuery {
  @Prop({ required: true })
  symptomText: string;

  @Prop([String])
  detectedSymptoms: string[];

  @Prop([String])
  suggestedCategories: string[];

  @Prop([String])
  productIds: string[];

  @Prop()
  aiReasoning: string;

  @Prop()
  confidenceScore: number;

  @Prop({ default: false })
  hadFollowUp: boolean;

  @Prop()
  sessionId: string;
}

export const SymptomQuerySchema = SchemaFactory.createForClass(SymptomQuery);
