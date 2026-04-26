import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { ProductDocument } from '../products/schemas/product.schema';
import { RawMaterialDocument } from '../raw-materials/schemas/raw-material.schema';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/order.dto';
export declare class OrdersService {
    private orderModel;
    private productModel;
    private rawMaterialModel;
    private productsService;
    constructor(orderModel: Model<OrderDocument>, productModel: Model<ProductDocument>, rawMaterialModel: Model<RawMaterialDocument>, productsService: ProductsService);
    private generateOrderNumber;
    create(dto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    getStats(): Promise<{
        totalOrders: number;
        totalRevenue: any;
        topProducts: any[];
        dailySales: any[];
    }>;
}
