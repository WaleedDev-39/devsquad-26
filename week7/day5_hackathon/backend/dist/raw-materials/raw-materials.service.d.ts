import { Model } from 'mongoose';
import { RawMaterial, RawMaterialDocument } from './schemas/raw-material.schema';
import { CreateRawMaterialDto, UpdateRawMaterialDto, RestockRawMaterialDto } from './dto/raw-material.dto';
export declare class RawMaterialsService {
    private rawMaterialModel;
    constructor(rawMaterialModel: Model<RawMaterialDocument>);
    create(dto: CreateRawMaterialDto): Promise<RawMaterial>;
    findAll(): Promise<RawMaterial[]>;
    findOne(id: string): Promise<RawMaterial>;
    update(id: string, dto: UpdateRawMaterialDto): Promise<RawMaterial>;
    restock(id: string, dto: RestockRawMaterialDto): Promise<RawMaterial>;
    remove(id: string): Promise<void>;
    getLowStockMaterials(): Promise<RawMaterial[]>;
}
