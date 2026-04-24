import { Document, Schema as MongooseSchema, Types } from 'mongoose';
export type CartDocument = Cart & Document;
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
export declare class Cart {
    userId: Types.ObjectId;
    items: CartItem[];
}
export declare const CartSchema: MongooseSchema<Cart, import("mongoose").Model<Cart, any, any, any, Document<unknown, any, Cart, any, {}> & Cart & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, Document<unknown, {}, import("mongoose").FlatRecord<Cart>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Cart> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
