export declare class OrderItemDto {
    product: string;
    quantity: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    notes?: string;
}
