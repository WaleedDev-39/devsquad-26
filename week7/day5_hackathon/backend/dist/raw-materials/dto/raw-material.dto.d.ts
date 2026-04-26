export declare class CreateRawMaterialDto {
    name: string;
    unit: string;
    currentStock: number;
    minimumStockAlert?: number;
}
export declare class UpdateRawMaterialDto {
    name?: string;
    unit?: string;
    currentStock?: number;
    minimumStockAlert?: number;
}
export declare class RestockRawMaterialDto {
    quantity: number;
}
