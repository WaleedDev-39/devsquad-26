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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const raw_material_schema_1 = require("../raw-materials/schemas/raw-material.schema");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    orderModel;
    productModel;
    rawMaterialModel;
    productsService;
    constructor(orderModel, productModel, rawMaterialModel, productsService) {
        this.orderModel = orderModel;
        this.productModel = productModel;
        this.rawMaterialModel = rawMaterialModel;
        this.productsService = productsService;
    }
    async generateOrderNumber() {
        const count = await this.orderModel.countDocuments();
        const pad = String(count + 1).padStart(5, '0');
        return `ORD-${pad}`;
    }
    async create(dto) {
        const orderItems = [];
        let totalAmount = 0;
        for (const item of dto.items) {
            const product = await this.productModel
                .findById(item.product)
                .populate('recipe.rawMaterial')
                .exec();
            if (!product)
                throw new common_1.NotFoundException(`Product #${item.product} not found`);
            for (const ingredient of product.recipe) {
                const rawMat = ingredient.rawMaterial;
                const required = ingredient.quantity * item.quantity;
                if (rawMat.currentStock < required) {
                    throw new common_1.BadRequestException(`Cannot complete order: Insufficient "${rawMat.name}" — need ${required} ${rawMat.unit}, available ${rawMat.currentStock} ${rawMat.unit}`);
                }
            }
            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;
            orderItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.price,
                subtotal,
            });
        }
        for (const item of dto.items) {
            await this.productsService.deductStockForSale(item.product, item.quantity);
        }
        const orderNumber = await this.generateOrderNumber();
        const order = new this.orderModel({
            orderNumber,
            items: orderItems,
            totalAmount,
            notes: dto.notes,
            status: 'completed',
        });
        return order.save();
    }
    async findAll() {
        return this.orderModel
            .find()
            .sort({ createdAt: -1 })
            .populate('items.product')
            .exec();
    }
    async findOne(id) {
        const order = await this.orderModel
            .findById(id)
            .populate('items.product')
            .exec();
        if (!order)
            throw new common_1.NotFoundException(`Order #${id} not found`);
        return order;
    }
    async getStats() {
        const [totalOrders, revenueResult, topProducts, dailySales] = await Promise.all([
            this.orderModel.countDocuments({ status: 'completed' }),
            this.orderModel.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
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
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                        },
                        orders: { $sum: 1 },
                        revenue: { $sum: '$totalAmount' },
                    },
                },
                { $sort: { _id: 1 } },
                { $limit: 7 },
            ]),
        ]);
        return {
            totalOrders,
            totalRevenue: revenueResult[0]?.total || 0,
            topProducts,
            dailySales,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(raw_material_schema_1.RawMaterial.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map