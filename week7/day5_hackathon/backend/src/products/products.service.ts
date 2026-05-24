import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { RawMaterial, RawMaterialDocument } from '../raw-materials/schemas/raw-material.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(RawMaterial.name) private rawMaterialModel: Model<RawMaterialDocument>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const created = new this.productModel(dto);
    return created.save();
  }

  async findAll(): Promise<any[]> {
    const products = await this.productModel
      .find()
      .populate('recipe.rawMaterial')
      .sort({ name: 1 })
      .exec();

    return Promise.all(products.map((p) => this.enrichWithStock(p)));
  }

  async findOne(id: string): Promise<any> {
    const product = await this.productModel
      .findById(id)
      .populate('recipe.rawMaterial')
      .exec();
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return this.enrichWithStock(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('recipe.rawMaterial')
      .exec();
    if (!updated) throw new NotFoundException(`Product #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Product #${id} not found`);
  }

  /**
   * CRITICAL: Calculate how many units of a product can be made
   * purely from current raw material stock. No manual product stock.
   */
  private enrichWithStock(product: ProductDocument): any {
    const obj = product.toObject();

    if (!obj.recipe || obj.recipe.length === 0) {
      obj.availableStock = 0;
      obj.canMake = false;
      return obj;
    }

    let maxUnits = Infinity;

    for (const ingredient of obj.recipe) {
      const rawMat = ingredient.rawMaterial as any;
      if (!rawMat || ingredient.quantity <= 0) continue;
      const possible = Math.floor(rawMat.currentStock / ingredient.quantity);
      if (possible < maxUnits) maxUnits = possible;
    }

    if (maxUnits === Infinity) maxUnits = 0;

    obj.availableStock = maxUnits;
    obj.canMake = maxUnits > 0;
    return obj;
  }

  /**
   * Deduct raw materials for a given product + quantity sold.
   * Called by OrdersService on sale completion.
   */
  async deductStockForSale(
    productId: string,
    quantitySold: number,
  ): Promise<void> {
    const product = await this.productModel
      .findById(productId)
      .populate('recipe.rawMaterial')
      .exec();
    if (!product) throw new NotFoundException(`Product #${productId} not found`);

    // Verify availability first
    for (const ingredient of product.recipe) {
      const rawMat = ingredient.rawMaterial as any;
      const required = ingredient.quantity * quantitySold;
      if (rawMat.currentStock < required) {
        throw new BadRequestException(
          `Insufficient stock of "${rawMat.name}": need ${required} ${rawMat.unit}, have ${rawMat.currentStock} ${rawMat.unit}`,
        );
      }
    }

    // Deduct stock from each raw material
    for (const ingredient of product.recipe) {
      const rawMat = ingredient.rawMaterial as any;
      const deduction = ingredient.quantity * quantitySold;
      await this.rawMaterialModel.findByIdAndUpdate(rawMat._id, {
        $inc: { currentStock: -deduction },
      });
    }
  }
}
