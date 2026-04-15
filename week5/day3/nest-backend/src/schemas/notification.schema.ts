import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId; // Recipient

  @Prop({ required: true })
  senderName: String;

  @Prop({ required: true, enum: ['BROADCAST', 'DIRECT', 'LIKE'] })
  type: String;

  @Prop({ required: true })
  message: String;

  @Prop({ default: false })
  read: Boolean;

  @Prop({ type: Object })
  metadata: any; // e.g., productID, reviewID
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
