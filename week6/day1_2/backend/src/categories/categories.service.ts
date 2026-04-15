import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async findAll() {
    return this.categoryModel.find().sort({ order: 1 });
  }

  async findBySlug(slug: string) {
    const category = await this.categoryModel.findOne({ slug });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(data: Partial<Category>) {
    return this.categoryModel.create(data);
  }

  async update(id: string, data: Partial<Category>) {
    return this.categoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.categoryModel.findByIdAndDelete(id);
  }
}
