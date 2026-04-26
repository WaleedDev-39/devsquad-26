import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';
export declare class OrdersController {
    private readonly service;
    constructor(service: OrdersService);
    create(dto: CreateOrderDto): Promise<import("./schemas/order.schema").Order>;
    findAll(): Promise<import("./schemas/order.schema").Order[]>;
    getStats(): Promise<{
        totalOrders: number;
        totalRevenue: any;
        topProducts: any[];
        dailySales: any[];
    }>;
    findOne(id: string): Promise<import("./schemas/order.schema").Order>;
}
