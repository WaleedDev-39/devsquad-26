import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus, PaymentStatus } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { StripeService } from '../stripe/stripe.service';

const POINTS_PER_DOLLAR = 1; // 1 point per $1 spent
const POINTS_VALUE = 0.01; // 1 point = $0.01

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private usersService: UsersService,
    private productsService: ProductsService,
    private stripeService: StripeService,
  ) {}

  async createOrder(userId: string, body: any) {
    const cart = await this.cartService.getCart(userId);
    if (!cart.items.length) throw new BadRequestException('Cart is empty');

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 200 ? 0 : 15;
    let discount = 0;

    if (body.promoCode === 'SAVE20') discount = Math.round(subtotal * 0.2);

    // Loyalty points payment
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
      const pId = (item.productId as any)._id || item.productId;
      const product = await this.productsService.findOne(pId.toString());
      if (product.earnedPoints && product.earnedPoints > 0) {
        loyaltyPointsEarned += product.earnedPoints * item.quantity;
      } else {
        // Fallback: 1 point per $1 spent on this item (ignoring overall order discounts)
        loyaltyPointsEarned += Math.floor(item.price * item.quantity * POINTS_PER_DOLLAR);
      }
    }

    const order = await this.orderModel.create({
      userId,
      items: cart.items.map((item) => ({
        productId: (item.productId as any)._id || item.productId,
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
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
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
      } catch (error: any) {
        await this.orderModel.findByIdAndDelete(order._id);
        if (loyaltyPointsSpent > 0) {
          await this.usersService.addLoyaltyPoints(userId, loyaltyPointsSpent);
        }
        throw new BadRequestException(error.message || 'Payment gateway error');
      }
    } else if (total === 0) {
      order.isPaid = true;
      order.status = OrderStatus.CONFIRMED;
      order.paymentStatus = PaymentStatus.SUCCESS;
      await order.save();
      await this.usersService.addLoyaltyPoints(userId, loyaltyPointsEarned);
    }

    await this.cartService.clearCart(userId);

    return { order, stripeUrl };
  }

  async getMyOrders(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.orderModel.findOne({ _id: orderId, userId });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getAllOrders() {
    return this.orderModel.find().populate('userId', 'name email').sort({ createdAt: -1 });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getDashboardStats() {
    const [totalOrders, activeOrders, completedOrders, cancelledOrders, totalSales] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({ status: { $in: [OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED] } }),
      this.orderModel.countDocuments({ status: OrderStatus.DELIVERED }),
      this.orderModel.countDocuments({ status: OrderStatus.CANCELLED }),
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
}
