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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stripe_1 = __importDefault(require("stripe"));
const order_schema_1 = require("../orders/schemas/order.schema");
const users_service_1 = require("../users/users.service");
let StripeService = StripeService_1 = class StripeService {
    constructor(configService, orderModel, usersService) {
        this.configService = configService;
        this.orderModel = orderModel;
        this.usersService = usersService;
        this.logger = new common_1.Logger(StripeService_1.name);
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2023-10-16',
        });
    }
    async createCheckoutSession(orderId, orderTotal, email) {
        const sessionConfig = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'SHOP.CO Order #' + orderId.slice(-6).toUpperCase(),
                        },
                        unit_amount: Math.round(orderTotal * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/checkout/cancel?order_id=${orderId}`,
            metadata: {
                orderId: orderId.toString(),
            },
        };
        if (email && email.trim() !== '') {
            sessionConfig.customer_email = email;
        }
        const session = await this.stripe.checkout.sessions.create(sessionConfig);
        return { sessionId: session.id, url: session.url };
    }
    async handleWebhook(signature, payload) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (err) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw err;
        }
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                await this.fulfillOrder(session);
                break;
            case 'checkout.session.async_payment_failed':
            case 'checkout.session.expired':
                const failedSession = event.data.object;
                await this.cancelOrder(failedSession);
                break;
            default:
                this.logger.log(`Unhandled event type: ${event.type}`);
        }
    }
    async fulfillOrder(session) {
        const orderId = session.metadata.orderId;
        const order = await this.orderModel.findById(orderId);
        if (order && !order.isPaid) {
            order.isPaid = true;
            order.status = order_schema_1.OrderStatus.CONFIRMED;
            order.paymentStatus = order_schema_1.PaymentStatus.SUCCESS;
            order.stripeSessionId = session.id;
            order.stripePaymentIntentId = session.payment_intent;
            await order.save();
            if (order.loyaltyPointsEarned > 0) {
                await this.usersService.addLoyaltyPoints(order.userId.toString(), order.loyaltyPointsEarned);
            }
            this.logger.log(`Order ${orderId} fulfilled successfully`);
        }
    }
    async cancelOrder(session) {
        const orderId = session.metadata.orderId;
        const order = await this.orderModel.findById(orderId);
        if (order && !order.isPaid) {
            order.status = order_schema_1.OrderStatus.CANCELLED;
            order.paymentStatus = order_schema_1.PaymentStatus.FAILED;
            await order.save();
            if (order.loyaltyPointsSpent > 0) {
                await this.usersService.addLoyaltyPoints(order.userId.toString(), order.loyaltyPointsSpent);
            }
            this.logger.log(`Order ${orderId} cancelled due to failed payment`);
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        users_service_1.UsersService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map