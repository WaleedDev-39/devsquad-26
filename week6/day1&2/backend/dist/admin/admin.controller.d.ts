import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { OrderStatus } from '../orders/schemas/order.schema';
export declare class AdminController {
    private productsService;
    private ordersService;
    private usersService;
    private categoriesService;
    private notificationsGateway;
    private readonly logger;
    constructor(productsService: ProductsService, ordersService: OrdersService, usersService: UsersService, categoriesService: CategoriesService, notificationsGateway: NotificationsGateway);
    uploadFile(file: any): {
        imageUrl: string;
    };
    getAllProducts(query: any): Promise<{
        products: (import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").ProductDocument, {}, {}> & import("../products/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createProduct(body: any): Promise<import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").ProductDocument, {}, {}> & import("../products/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateProduct(id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").ProductDocument, {}, {}> & import("../products/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    applySale(id: string, salePercent: number): Promise<import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").ProductDocument, {}, {}> & import("../products/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    removeSale(id: string): Promise<import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").ProductDocument, {}, {}> & import("../products/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllOrders(): Promise<(import("mongoose").Document<unknown, {}, import("../orders/schemas/order.schema").OrderDocument, {}, {}> & import("../orders/schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateOrderStatus(id: string, status: OrderStatus): Promise<import("mongoose").Document<unknown, {}, import("../orders/schemas/order.schema").OrderDocument, {}, {}> & import("../orders/schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllUsers(): Promise<(import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, {}> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUser(id: string): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, {}> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateUserRole(id: string, role: string): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, {}> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    createCategory(body: any): Promise<import("mongoose").Document<unknown, {}, import("../categories/schemas/category.schema").CategoryDocument, {}, {}> & import("../categories/schemas/category.schema").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateCategory(id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("../categories/schemas/category.schema").CategoryDocument, {}, {}> & import("../categories/schemas/category.schema").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteCategory(id: string): Promise<import("mongoose").Document<unknown, {}, import("../categories/schemas/category.schema").CategoryDocument, {}, {}> & import("../categories/schemas/category.schema").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getStats(): Promise<{
        totalOrders: number;
        activeOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        totalSales: any;
    }>;
    getSalesGraph(): Promise<{
        name: string;
        value: any;
    }[]>;
    getBestSellers(limit?: number): Promise<(import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").ProductDocument, {}, {}> & import("../products/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
