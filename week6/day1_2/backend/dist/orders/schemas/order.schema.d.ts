import { Document, Schema as MongooseSchema, Types } from 'mongoose';
export type OrderDocument = Order & Document;
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed"
}
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
export declare class Order {
    userId: Types.ObjectId;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    promoCode: string;
    status: OrderStatus;
    loyaltyPointsEarned: number;
    loyaltyPointsSpent: number;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    isPaid: boolean;
    stripeSessionId: string;
    stripePaymentIntentId: string;
}
export declare const OrderSchema: MongooseSchema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
