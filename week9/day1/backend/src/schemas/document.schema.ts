import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentDocument = ResearchDocument & Document;

@Schema({ timestamps: true })
export class ResearchDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: () => new Date().toISOString().split('T')[0] })
  createdAt: string;

  @Prop({ default: 0 })
  wordCount: number;

  @Prop({ default: 0 })
  viewCount: number;
}

export const ResearchDocumentSchema =
  SchemaFactory.createForClass(ResearchDocument);

// Enable full text search index on content and title
ResearchDocumentSchema.index({ content: 'text', title: 'text', tags: 'text' });
