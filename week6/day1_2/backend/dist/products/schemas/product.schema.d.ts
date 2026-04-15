import { Document, Types } from 'mongoose';
export type ProductDocument = Product & Document;
export declare enum PurchaseType {
    MONEY = "money",
    POINTS = "points",
    HYBRID = "hybrid"
}
export declare class Product {
    name: string;
    description: string;
    images: string[];
    price: number;
    originalPrice: number;
    stock: number;
    category: string;
    subCategory: string;
    colors: string[];
    sizes: string[];
    rating: number;
    reviewCount: number;
    isOnSale: boolean;
    salePercent: number;
    purchaseType: PurchaseType;
    pointsPrice: number;
    earnedPoints: number;
    brand: string;
    dressStyle: string;
    tags: string[];
    isActive: boolean;
    isNewArrival: boolean;
    isTopSelling: boolean;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Product> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
