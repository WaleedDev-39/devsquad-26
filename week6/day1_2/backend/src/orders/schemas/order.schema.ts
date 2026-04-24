import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

// Raw Mongoose subdocument schemas (more reliable than SchemaFactory for nested docs)
const OrderItemRawSchema = new MongooseSchema(
  {
    productId: { type: MongooseSchema.Types.ObjectId, ref: 'Product' },
    name:      { type: String, required: true },
    image:     { type: String },
    price:     { type: Number, required: true },
    quantity:  { type: Number, required: true },
    size:      { type: String },
    color:     { type: String },
  },
  { _id: true },
);

const ShippingAddressRawSchema = new MongooseSchema(
  {
    fullName:   { type: String, required: true },
    address:    { type: String, required: true },
    city:       { type: String, required: true },
    postalCode: { type: String, required: true },
    country:    { type: String, required: true },
    phone:      { type: String },
  },
  { _id: false },
);

export interface OrderItem {
  productId?: Types.ObjectId;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItemRawSchema], default: [] })
  items: OrderItem[];

  @Prop({ type: ShippingAddressRawSchema })
  shippingAddress: ShippingAddress;

  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 15 })
  deliveryFee: number;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({ default: null })
  promoCode: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ default: 0 })
  loyaltyPointsEarned: number;

  @Prop({ default: 0 })
  loyaltyPointsSpent: number;

  @Prop({ default: 'stripe' })
  paymentMethod: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  stripeSessionId: string;

  @Prop()
  stripePaymentIntentId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
