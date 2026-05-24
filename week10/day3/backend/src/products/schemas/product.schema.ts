import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop()
  price: number;

  @Prop()
  currency: string;

  @Prop([String])
  benefits: string[];

  @Prop([String])
  tags: string[];

  @Prop({ default: true })
  inStock: boolean;

  @Prop()
  rating: number;

  @Prop()
  reviewCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
