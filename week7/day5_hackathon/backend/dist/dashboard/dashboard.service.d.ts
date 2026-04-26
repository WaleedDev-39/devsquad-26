import { Model } from 'mongoose';
import { RawMaterial, RawMaterialDocument } from '../raw-materials/schemas/raw-material.schema';
import { ProductDocument } from '../products/schemas/product.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
export declare class DashboardService {
    private rawMaterialModel;
    private productModel;
    private orderModel;
    constructor(rawMaterialModel: Model<RawMaterialDocument>, productModel: Model<ProductDocument>, orderModel: Model<OrderDocument>);
    getSummary(): Promise<{
        stats: {
            totalOrders: number;
            totalRevenue: any;
            totalProducts: number;
            totalRawMaterials: number;
            lowStockCount: number;
        };
        lowStockMaterials: (import("mongoose").Document<unknown, {}, RawMaterialDocument, {}, import("mongoose").DefaultSchemaOptions> & RawMaterial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        topProducts: any[];
        dailySales: any[];
        recentOrders: (import("mongoose").Document<unknown, {}, OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        inventoryStatus: {
            name: string;
            unit: string;
            currentStock: number;
            minimumStockAlert: number;
            isLow: boolean;
        }[];
    }>;
}
