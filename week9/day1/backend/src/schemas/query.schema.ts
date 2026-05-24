import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QueryDocument = ResearchQuery & Document;

@Schema({ timestamps: true })
export class ResearchQuery {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [String], default: [] })
  subQuestions: string[];

  @Prop({ default: '' })
  finalAnswer: string;

  @Prop({ default: '' })
  traceId: string;

  @Prop({ type: [String], default: [] })
  sourceDocs: string[];

  @Prop({ type: [Object], default: [] })
  contradictions: Array<{ claim1: string; claim2: string; source1: string; source2: string }>;

  @Prop({ default: 0 })
  durationMs: number;
}

export const ResearchQuerySchema = SchemaFactory.createForClass(ResearchQuery);
