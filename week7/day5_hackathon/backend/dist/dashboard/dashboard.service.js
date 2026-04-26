"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const raw_material_schema_1 = require("../raw-materials/schemas/raw-material.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
let DashboardService = class DashboardService {
    rawMaterialModel;
    productModel;
    orderModel;
    constructor(rawMaterialModel, productModel, orderModel) {
        this.rawMaterialModel = rawMaterialModel;
        this.productModel = productModel;
        this.orderModel = orderModel;
    }
    async getSummary() {
        const [totalOrders, revenueResult, totalProducts, totalRawMaterials, lowStockMaterials, topProducts, dailySales, recentOrders,] = await Promise.all([
            this.orderModel.countDocuments({ status: 'completed' }),
            this.orderModel.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
            this.productModel.countDocuments(),
            this.rawMaterialModel.countDocuments(),
            this.rawMaterialModel.find({
                $expr: {
                    $and: [
                        { $gt: ['$minimumStockAlert', 0] },
                        { $lte: ['$currentStock', '$minimumStockAlert'] },
                    ],
                },
            }).limit(10),
            this.orderModel.aggregate([
                { $match: { status: 'completed' } },
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.product',
                        productName: { $first: '$items.productName' },
                        totalSold: { $sum: '$items.quantity' },
                        totalRevenue: { $sum: '$items.subtotal' },
                    },
                },
                { $sort: { totalSold: -1 } },
                { $limit: 5 },
            ]),
            this.orderModel.aggregate([
                { $match: { status: 'completed' } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        orders: { $sum: 1 },
                        revenue: { $sum: '$totalAmount' },
                    },
                },
                { $sort: { _id: 1 } },
                { $limit: 14 },
            ]),
            this.orderModel
                .find({ status: 'completed' })
                .sort({ createdAt: -1 })
                .limit(5)
                .exec(),
        ]);
        const allMaterials = await this.rawMaterialModel.find().exec();
        const inventoryStatus = allMaterials.map((m) => ({
            name: m.name,
            unit: m.unit,
            currentStock: m.currentStock,
            minimumStockAlert: m.minimumStockAlert,
            isLow: m.minimumStockAlert > 0 && m.currentStock <= m.minimumStockAlert,
        }));
        return {
            stats: {
                totalOrders,
                totalRevenue: revenueResult[0]?.total || 0,
                totalProducts,
                totalRawMaterials,
                lowStockCount: lowStockMaterials.length,
            },
            lowStockMaterials,
            topProducts,
            dailySales,
            recentOrders,
            inventoryStatus,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(raw_material_schema_1.RawMaterial.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map