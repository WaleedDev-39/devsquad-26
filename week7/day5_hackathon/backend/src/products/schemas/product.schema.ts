import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class RecipeIngredient {
  @Prop({ type: Types.ObjectId, ref: 'RawMaterial', required: true })
  rawMaterial: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  quantity: number;
}

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ trim: true })
  description: string;

  @Prop({ trim: true })
  category: string;

  @Prop({
    type: [
      {
        rawMaterial: { type: Types.ObjectId, ref: 'RawMaterial' },
        quantity: { type: Number, min: 0 },
      },
    ],
    default: [],
  })
  recipe: RecipeIngredient[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
