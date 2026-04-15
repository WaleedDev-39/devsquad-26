import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async findAll(query: any) {
    const {
      category, style, color, size, minPrice, maxPrice,
      sort = 'createdAt', page = 1, limit = 9, search, brand,
    } = query;

    const filter: any = { isActive: true };
    if (category) filter.$or = [{ category }, { subCategory: category }];
    if (style) filter.dressStyle = style;
    if (color) filter.colors = { $in: [color] };
    if (size) filter.sizes = { $in: [size] };
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const sortObj: any = {};
    if (sort === 'price-asc') sortObj.price = 1;
    else if (sort === 'price-desc') sortObj.price = -1;
    else if (sort === 'rating') sortObj.rating = -1;
    else if (sort === 'newest') sortObj.createdAt = -1;
    else sortObj.createdAt = -1;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      this.productModel.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      this.productModel.countDocuments(filter),
    ]);

    return {
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async findNewArrivals(limit = 4) {
    return this.productModel.find({ isActive: true, isNewArrival: true }).sort({ createdAt: -1 }).limit(limit);
  }

  async findTopSelling(limit = 4) {
    return this.productModel.find({ isActive: true, isTopSelling: true }).sort({ reviewCount: -1 }).limit(limit);
  }

  async findOnSale(limit = 12) {
    return this.productModel.find({ isActive: true, isOnSale: true }).sort({ salePercent: -1 }).limit(limit);
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findRelated(id: string, limit = 4) {
    const product = await this.findOne(id);
    return this.productModel
      .find({ _id: { $ne: id }, category: product.category, isActive: true })
      .limit(limit);
  }

  async create(data: Partial<Product>) {
    return this.productModel.create(data);
  }

  async update(id: string, data: Partial<Product>) {
    const product = await this.productModel.findByIdAndUpdate(id, data, { new: true });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async delete(id: string) {
    await this.productModel.findByIdAndUpdate(id, { isActive: false });
    return { message: 'Product deleted' };
  }

  async applySale(id: string, salePercent: number) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    const originalPrice = product.originalPrice || product.price;
    const newPrice = Math.round(originalPrice * (1 - salePercent / 100));
    return this.productModel.findByIdAndUpdate(
      id,
      { isOnSale: true, salePercent, originalPrice, price: newPrice },
      { new: true },
    );
  }

  async removeSale(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return this.productModel.findByIdAndUpdate(
      id,
      { isOnSale: false, salePercent: 0, price: product.originalPrice || product.price },
      { new: true },
    );
  }

  async updateRating(productId: string, newRating: number, reviewCount: number) {
    return this.productModel.findByIdAndUpdate(
      productId,
      { rating: newRating, reviewCount },
      { new: true },
    );
  }
}
