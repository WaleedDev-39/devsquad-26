import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema()
class Reply {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  userName: String;

  @Prop({ required: true })
  comment: String;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const ReplySchema = SchemaFactory.createForClass(Reply);

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  userName: String;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: String;

  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: [ReplySchema], default: [] })
  replies: Reply[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
