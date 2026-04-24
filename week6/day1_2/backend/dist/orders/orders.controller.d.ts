import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    createOrder(req: any, body: any): Promise<{
        order: import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        stripeUrl: any;
    }>;
    getMyOrders(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getOrderById(req: any, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").OrderDocument, {}, {}> & import("./schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
