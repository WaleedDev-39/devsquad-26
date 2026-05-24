import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawMaterial, RawMaterialDocument } from '../raw-materials/schemas/raw-material.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(RawMaterial.name) private rawMaterialModel: Model<RawMaterialDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getSummary() {
    const [
      totalOrders,
      revenueResult,
      totalProducts,
      totalRawMaterials,
      lowStockMaterials,
      topProducts,
      dailySales,
      recentOrders,
    ] = await Promise.all([
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

    // Inventory status for all raw materials
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
}
