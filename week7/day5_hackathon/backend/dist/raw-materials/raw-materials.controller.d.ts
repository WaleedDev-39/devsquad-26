import { RawMaterialsService } from './raw-materials.service';
import { CreateRawMaterialDto, UpdateRawMaterialDto, RestockRawMaterialDto } from './dto/raw-material.dto';
export declare class RawMaterialsController {
    private readonly service;
    constructor(service: RawMaterialsService);
    create(dto: CreateRawMaterialDto): Promise<import("./schemas/raw-material.schema").RawMaterial>;
    findAll(): Promise<import("./schemas/raw-material.schema").RawMaterial[]>;
    getLowStock(): Promise<import("./schemas/raw-material.schema").RawMaterial[]>;
    findOne(id: string): Promise<import("./schemas/raw-material.schema").RawMaterial>;
    update(id: string, dto: UpdateRawMaterialDto): Promise<import("./schemas/raw-material.schema").RawMaterial>;
    restock(id: string, dto: RestockRawMaterialDto): Promise<import("./schemas/raw-material.schema").RawMaterial>;
    remove(id: string): Promise<void>;
}
