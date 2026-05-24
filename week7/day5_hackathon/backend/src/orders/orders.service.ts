import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { RawMaterial, RawMaterialDocument } from '../raw-materials/schemas/raw-material.schema';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(RawMaterial.name) private rawMaterialModel: Model<RawMaterialDocument>,
    private productsService: ProductsService,
  ) {}

  private async generateOrderNumber(): Promise<string> {
    const count = await this.orderModel.countDocuments();
    const pad = String(count + 1).padStart(5, '0');
    return `ORD-${pad}`;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const orderItems: any[] = [];
    let totalAmount = 0;

    // Step 1: Validate all items and calculate totals
    for (const item of dto.items) {
      const product = await this.productModel
        .findById(item.product)
        .populate('recipe.rawMaterial')
        .exec();
      if (!product) throw new NotFoundException(`Product #${item.product} not found`);

      // Step 2: Check raw material availability (backend enforced)
      for (const ingredient of product.recipe) {
        const rawMat = ingredient.rawMaterial as any;
        const required = ingredient.quantity * item.quantity;
        if (rawMat.currentStock < required) {
          throw new BadRequestException(
            `Cannot complete order: Insufficient "${rawMat.name}" — need ${required} ${rawMat.unit}, available ${rawMat.currentStock} ${rawMat.unit}`,
          );
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

    // Step 3: Deduct raw materials for ALL items atomically
    for (const item of dto.items) {
      await this.productsService.deductStockForSale(item.product, item.quantity);
    }

    // Step 4: Save order
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

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .populate('items.product')
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('items.product')
      .exec();
    if (!order) throw new NotFoundException(`Order #${id} not found`);
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
}
