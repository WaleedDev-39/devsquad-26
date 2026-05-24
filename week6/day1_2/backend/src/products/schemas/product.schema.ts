import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export enum PurchaseType {
  MONEY = 'money',
  POINTS = 'points',
  HYBRID = 'hybrid',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: null })
  originalPrice: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ trim: true })
  category: string;

  @Prop({ trim: true })
  subCategory: string;

  @Prop({ type: [String], default: [] })
  colors: string[];

  @Prop({ type: [String], default: [] })
  sizes: string[];

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: false })
  isOnSale: boolean;

  @Prop({ default: 0 })
  salePercent: number;

  @Prop({ type: String, enum: PurchaseType, default: PurchaseType.MONEY })
  purchaseType: PurchaseType;

  @Prop({ default: null })
  pointsPrice: number;

  @Prop({ default: 0 })
  earnedPoints: number;

  @Prop({ trim: true })
  brand: string;

  @Prop({ trim: true })
  dressStyle: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isNewArrival: boolean;

  @Prop({ default: false })
  isTopSelling: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
