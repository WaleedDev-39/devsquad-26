import { Injectable, Logger, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Order, OrderDocument, OrderStatus, PaymentStatus } from '../orders/schemas/order.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class StripeService {
  private stripe: any;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private usersService: UsersService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16' as any,
    });
  }

  async createCheckoutSession(orderId: string, orderTotal: number, email?: string) {
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'SHOP.CO Order #' + orderId.slice(-6).toUpperCase(),
            },
            unit_amount: Math.round(orderTotal * 100), // Stripe expects cents
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

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw err;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as any;
        await this.fulfillOrder(session);
        break;
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired':
        const failedSession = event.data.object as any;
        await this.cancelOrder(failedSession);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async fulfillOrder(session: any) {
    const orderId = session.metadata.orderId;
    const order = await this.orderModel.findById(orderId);
    
    if (order && !order.isPaid) {
      order.isPaid = true;
      order.status = OrderStatus.CONFIRMED;
      order.paymentStatus = PaymentStatus.SUCCESS;
      order.stripeSessionId = session.id;
      order.stripePaymentIntentId = session.payment_intent as string;
      await order.save();

      // Award loyalty points
      if (order.loyaltyPointsEarned > 0) {
        await this.usersService.addLoyaltyPoints(order.userId.toString(), order.loyaltyPointsEarned);
      }
      this.logger.log(`Order ${orderId} fulfilled successfully`);
    }
  }

  private async cancelOrder(session: any) {
    const orderId = session.metadata.orderId;
    const order = await this.orderModel.findById(orderId);
    
    if (order && !order.isPaid) {
      order.status = OrderStatus.CANCELLED;
      order.paymentStatus = PaymentStatus.FAILED;
      await order.save();

      // Refund spent points if any
      if (order.loyaltyPointsSpent > 0) {
        await this.usersService.addLoyaltyPoints(order.userId.toString(), order.loyaltyPointsSpent);
      }
      this.logger.log(`Order ${orderId} cancelled due to failed payment`);
    }
  }
}
