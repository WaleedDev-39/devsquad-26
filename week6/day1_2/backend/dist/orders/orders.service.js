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
const cart_service_1 = require("../cart/cart.service");
const users_service_1 = require("../users/users.service");
const products_service_1 = require("../products/products.service");
const stripe_service_1 = require("../stripe/stripe.service");
const POINTS_PER_DOLLAR = 1;
const POINTS_VALUE = 0.01;
let OrdersService = class OrdersService {
    constructor(orderModel, cartService, usersService, productsService, stripeService) {
        this.orderModel = orderModel;
        this.cartService = cartService;
        this.usersService = usersService;
        this.productsService = productsService;
        this.stripeService = stripeService;
    }
    async createOrder(userId, body) {
        const cart = await this.cartService.getCart(userId);
        if (!cart.items.length)
            throw new common_1.BadRequestException('Cart is empty');
        const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = subtotal > 200 ? 0 : 15;
        let discount = 0;
        if (body.promoCode === 'SAVE20')
            discount = Math.round(subtotal * 0.2);
        let loyaltyPointsSpent = 0;
        if (body.usePoints && body.pointsToSpend) {
            const user = await this.usersService.getProfile(userId);
            const maxPoints = Math.min(body.pointsToSpend, user.loyaltyPoints);
            loyaltyPointsSpent = maxPoints;
            discount += Math.round(maxPoints * POINTS_VALUE * 100) / 100;
        }
        const total = Math.max(0, subtotal - discount + deliveryFee);
        let loyaltyPointsEarned = 0;
        for (const item of cart.items) {
            const pId = item.productId._id || item.productId;
            const product = await this.productsService.findOne(pId.toString());
            if (product.earnedPoints && product.earnedPoints > 0) {
                loyaltyPointsEarned += product.earnedPoints * item.quantity;
            }
            else {
                loyaltyPointsEarned += Math.floor(item.price * item.quantity * POINTS_PER_DOLLAR);
            }
        }
        const order = await this.orderModel.create({
            userId,
            items: cart.items.map((item) => ({
                productId: item.productId._id || item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
            })),
            shippingAddress: body.shippingAddress,
            subtotal,
            discount,
            deliveryFee,
            total,
            promoCode: body.promoCode || null,
            loyaltyPointsEarned,
            loyaltyPointsSpent,
            paymentMethod: body.paymentMethod || 'stripe',
            isPaid: false,
            status: order_schema_1.OrderStatus.PENDING,
            paymentStatus: order_schema_1.PaymentStatus.PENDING,
        });
        if (loyaltyPointsSpent > 0) {
            await this.usersService.deductLoyaltyPoints(userId, loyaltyPointsSpent);
        }
        let stripeUrl = null;
        if (total > 0 && (body.paymentMethod === 'stripe' || !body.paymentMethod)) {
            const user = await this.usersService.getProfile(userId);
            try {
                const session = await this.stripeService.createCheckoutSession(order._id.toString(), total, user.email);
                stripeUrl = session.url;
                order.stripeSessionId = session.sessionId;
                await order.save();
            }
            catch (error) {
                await this.orderModel.findByIdAndDelete(order._id);
                if (loyaltyPointsSpent > 0) {
                    await this.usersService.addLoyaltyPoints(userId, loyaltyPointsSpent);
                }
                throw new common_1.BadRequestException(error.message || 'Payment gateway error');
            }
        }
        else if (total === 0) {
            order.isPaid = true;
            order.status = order_schema_1.OrderStatus.CONFIRMED;
            order.paymentStatus = order_schema_1.PaymentStatus.SUCCESS;
            await order.save();
            await this.usersService.addLoyaltyPoints(userId, loyaltyPointsEarned);
        }
        await this.cartService.clearCart(userId);
        return { order, stripeUrl };
    }
    async getMyOrders(userId) {
        return this.orderModel.find({ userId }).sort({ createdAt: -1 });
    }
    async getOrderById(userId, orderId) {
        const order = await this.orderModel.findOne({ _id: orderId, userId });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async getAllOrders() {
        return this.orderModel.find().populate('userId', 'name email').sort({ createdAt: -1 });
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async getDashboardStats() {
        const [totalOrders, activeOrders, completedOrders, cancelledOrders, totalSales] = await Promise.all([
            this.orderModel.countDocuments(),
            this.orderModel.countDocuments({ status: { $in: [order_schema_1.OrderStatus.CONFIRMED, order_schema_1.OrderStatus.PROCESSING, order_schema_1.OrderStatus.SHIPPED] } }),
            this.orderModel.countDocuments({ status: order_schema_1.OrderStatus.DELIVERED }),
            this.orderModel.countDocuments({ status: order_schema_1.OrderStatus.CANCELLED }),
            this.orderModel.aggregate([
                { $match: { isPaid: true } },
                { $group: { _id: null, total: { $sum: '$total' } } },
            ]),
        ]);
        return {
            totalOrders,
            activeOrders,
            completedOrders,
            cancelledOrders,
            totalSales: totalSales[0]?.total || 0,
        };
    }
    async getSalesGraphData() {
        const last6Months = new Date();
        last6Months.setMonth(last6Months.getMonth() - 5);
        last6Months.setDate(1);
        last6Months.setHours(0, 0, 0, 0);
        const sales = await this.orderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: last6Months },
                    isPaid: true,
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' },
                    },
                    total: { $sum: '$total' },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return sales.map((s) => ({
            name: months[s._id.month - 1],
            value: s.total,
        }));
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cart_service_1.CartService,
        users_service_1.UsersService,
        products_service_1.ProductsService,
        stripe_service_1.StripeService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map