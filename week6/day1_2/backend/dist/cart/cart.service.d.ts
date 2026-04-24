import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';
export declare class CartService {
    private cartModel;
    private productsService;
    constructor(cartModel: Model<CartDocument>, productsService: ProductsService);
    private toObjectId;
    getCart(userId: string): Promise<import("mongoose").Document<unknown, {}, CartDocument, {}, {}> & Cart & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addItem(userId: string, body: {
        productId: string;
        quantity: number;
        size: string;
        color: string;
    }): Promise<import("mongoose").Document<unknown, {}, CartDocument, {}, {}> & Cart & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateItem(userId: string, itemId: string, quantity: number): Promise<import("mongoose").Document<unknown, {}, CartDocument, {}, {}> & Cart & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    removeItem(userId: string, itemId: string): Promise<import("mongoose").Document<unknown, {}, CartDocument, {}, {}> & Cart & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    clearCart(userId: string): Promise<import("mongoose").Document<unknown, {}, CartDocument, {}, {}> & Cart & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
