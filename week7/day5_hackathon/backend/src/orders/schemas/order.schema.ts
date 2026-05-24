import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop({ required: true, min: 0 })
  subtotal: number;
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product' },
        productName: String,
        quantity: { type: Number, min: 1 },
        unitPrice: { type: Number, min: 0 },
        subtotal: { type: Number, min: 0 },
      },
    ],
    default: [],
  })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @Prop({ enum: ['completed', 'cancelled'], default: 'completed' })
  status: string;

  @Prop({ trim: true })
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
