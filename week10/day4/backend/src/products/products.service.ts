import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().lean().exec();
  }

  async search(query: string): Promise<Product[]> {
    const regex = new RegExp(query, 'i');
    return this.productModel
      .find({
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
          { tags: { $in: [regex] } },
        ],
      })
      .limit(6)
      .lean()
      .exec();
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return this.productModel
      .find({ _id: { $in: ids } })
      .lean()
      .exec();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel
      .find({ category: new RegExp(category, 'i') })
      .lean()
      .exec();
  }
}
