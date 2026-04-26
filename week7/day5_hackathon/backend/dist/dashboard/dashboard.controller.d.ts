import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly service;
    constructor(service: DashboardService);
    getSummary(): Promise<{
        stats: {
            totalOrders: number;
            totalRevenue: any;
            totalProducts: number;
            totalRawMaterials: number;
            lowStockCount: number;
        };
        lowStockMaterials: (import("mongoose").Document<unknown, {}, import("../raw-materials/schemas/raw-material.schema").RawMaterialDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../raw-materials/schemas/raw-material.schema").RawMaterial & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        topProducts: any[];
        dailySales: any[];
        recentOrders: (import("mongoose").Document<unknown, {}, import("../orders/schemas/order.schema").OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../orders/schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
