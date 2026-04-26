import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawMaterial, RawMaterialDocument } from './schemas/raw-material.schema';
import { CreateRawMaterialDto, UpdateRawMaterialDto, RestockRawMaterialDto } from './dto/raw-material.dto';

@Injectable()
export class RawMaterialsService {
  constructor(
    @InjectModel(RawMaterial.name)
    private rawMaterialModel: Model<RawMaterialDocument>,
  ) {}

  async create(dto: CreateRawMaterialDto): Promise<RawMaterial> {
    const created = new this.rawMaterialModel(dto);
    return created.save();
  }

  async findAll(): Promise<RawMaterial[]> {
    return this.rawMaterialModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<RawMaterial> {
    const mat = await this.rawMaterialModel.findById(id).exec();
    if (!mat) throw new NotFoundException(`Raw material #${id} not found`);
    return mat;
  }

  async update(id: string, dto: UpdateRawMaterialDto): Promise<RawMaterial> {
    const updated = await this.rawMaterialModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Raw material #${id} not found`);
    return updated;
  }

  async restock(id: string, dto: RestockRawMaterialDto): Promise<RawMaterial> {
    const mat = await this.rawMaterialModel.findById(id).exec();
    if (!mat) throw new NotFoundException(`Raw material #${id} not found`);
    mat.currentStock += dto.quantity;
    return mat.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.rawMaterialModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Raw material #${id} not found`);
  }

  async getLowStockMaterials(): Promise<RawMaterial[]> {
    return this.rawMaterialModel
      .find({
        $expr: {
          $and: [
            { $gt: ['$minimumStockAlert', 0] },
            { $lte: ['$currentStock', '$minimumStockAlert'] },
          ],
        },
      })
      .exec();
  }
}
