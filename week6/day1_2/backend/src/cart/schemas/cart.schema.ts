import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CartDocument = Cart & Document;

// Define CartItem as a raw Mongoose schema (more reliable than SchemaFactory for subdocuments)
const CartItemRawSchema = new MongooseSchema(
  {
    productId: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
    quantity:  { type: Number, required: true, min: 1 },
    size:      { type: String, required: true },
    color:     { type: String, required: true },
    price:     { type: Number, required: true },
    name:      { type: String, required: true },
    image:     { type: String, default: '' },
  },
  { _id: true },
);

// Export interface so TypeScript knows the shape
export interface CartItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  size: string;
  color: string;
  price: number;
  name: string;
  image: string;
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true})
  userId: Types.ObjectId;

  @Prop({ type: [CartItemRawSchema], default: [] })
  items: CartItem[];

  
}

export const CartSchema = SchemaFactory.createForClass(Cart);
