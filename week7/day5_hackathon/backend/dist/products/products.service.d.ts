import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { RawMaterialDocument } from '../raw-materials/schemas/raw-material.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private productModel;
    private rawMaterialModel;
    constructor(productModel: Model<ProductDocument>, rawMaterialModel: Model<RawMaterialDocument>);
    create(dto: CreateProductDto): Promise<Product>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    private enrichWithStock;
    deductStockForSale(productId: string, quantitySold: number): Promise<void>;
}
