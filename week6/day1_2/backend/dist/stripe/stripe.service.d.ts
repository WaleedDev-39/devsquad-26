import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { OrderDocument } from '../orders/schemas/order.schema';
import { UsersService } from '../users/users.service';
export declare class StripeService {
    private configService;
    private orderModel;
    private usersService;
    private stripe;
    private readonly logger;
    constructor(configService: ConfigService, orderModel: Model<OrderDocument>, usersService: UsersService);
    createCheckoutSession(orderId: string, orderTotal: number, email?: string): Promise<{
        sessionId: any;
        url: any;
    }>;
    handleWebhook(signature: string, payload: Buffer): Promise<void>;
    private fulfillOrder;
    private cancelOrder;
}
