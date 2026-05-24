import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = Document & MongooseDocument;

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  textContent: string;

  @Prop([String])
  chunks: string[];

  @Prop()
  documentType?: string;

  @Prop([String])
  themes?: string[];

  @Prop()
  summary?: string;

  @Prop([String])
  bulletPoints?: string[];
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
