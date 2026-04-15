import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({
    required: true,
    enum: ['sedan', 'sports', 'hatchback', 'convertible', 'suv', 'coupe', 'truck', 'van'],
  })
  category: string;

  @Prop()
  color: string;

  @Prop()
  paint: string;

  @Prop()
  mileage: number;

  @Prop()
  engineSize: string;

  @Prop()
  vin: string;

  @Prop()
  description: string;

  @Prop()
  features: string;

  @Prop({ type: [String], default: [] })
  photos: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: Types.ObjectId;

  @Prop({ required: true })
  startingBid: number;

  @Prop({ default: 0 })
  currentBid: number;

  @Prop({ default: 100 })
  minIncrement: number;

  @Prop({ default: 0 })
  totalBids: number;

  @Prop({ required: true })
  endTime: Date;

  @Prop({
    type: String,
    enum: ['active', 'ended', 'sold', 'delivered'],
    default: 'active',
  })
  status: string;

  @Prop()
  hasGccSpecs: string;

  @Prop()
  accidentHistory: string;

  @Prop()
  fullServiceHistory: string;

  @Prop({ default: false })
  isModified: boolean;

  @Prop({ default: false })
  isTrending: boolean;

  @Prop()
  lotNumber: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  winner: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'shipping', 'in_transit', 'delivered'],
    default: 'pending',
  })
  paymentStatus: string;

  @Prop()
  paymentDate: Date;

  @Prop()
  expectedDeliveryDate: Date;

  @Prop()
  sellerFirstName: string;

  @Prop()
  sellerLastName: string;

  @Prop()
  sellerEmail: string;

  @Prop()
  sellerPhone: string;

  @Prop()
  sellerType: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);
