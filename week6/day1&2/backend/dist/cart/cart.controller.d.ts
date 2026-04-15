import { CartService } from './cart.service';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").CartDocument, {}, {}> & import("./schemas/cart.schema").Cart & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addItem(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").CartDocument, {}, {}> & import("./schemas/cart.schema").Cart & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateItem(req: any, itemId: string, quantity: number): Promise<import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").CartDocument, {}, {}> & import("./schemas/cart.schema").Cart & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    removeItem(req: any, itemId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").CartDocument, {}, {}> & import("./schemas/cart.schema").Cart & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    clearCart(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/cart.schema").CartDocument, {}, {}> & import("./schemas/cart.schema").Cart & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
