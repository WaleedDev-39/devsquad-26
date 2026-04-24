import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { StripeService } from '../stripe/stripe.service';
export declare class OrdersService {
    private orderModel;
    private cartService;
    private usersService;
    private productsService;
    private stripeService;
    constructor(orderModel: Model<OrderDocument>, cartService: CartService, usersService: UsersService, productsService: ProductsService, stripeService: StripeService);
    createOrder(userId: string, body: any): Promise<{
        order: import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        stripeUrl: any;
    }>;
    getMyOrders(userId: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getOrderById(userId: string, orderId: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllOrders(): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getDashboardStats(): Promise<{
        totalOrders: number;
        activeOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        totalSales: any;
    }>;
    getSalesGraphData(): Promise<{
        name: string;
        value: any;
    }[]>;
}
