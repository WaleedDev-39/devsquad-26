import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  private toObjectId(id: string): Types.ObjectId {
    try {
      return new Types.ObjectId(id);
    } catch {
      throw new BadRequestException(`Invalid ID: ${id}`);
    }
  }

  async getCart(userId: string) {
    let cart = await this.cartModel.findOne({ userId: this.toObjectId(userId) });
    if (!cart) cart = await this.cartModel.create({ userId: this.toObjectId(userId), items: [] });
    return cart;
  }

  async addItem(userId: string, body: { productId: string; quantity: number; size: string; color: string }) {
    console.log(`[CartService.addItem] userId=${userId} productId=${body.productId} size=${body.size} color=${body.color} qty=${body.quantity}`);

    if (!body.productId) {
      throw new BadRequestException('Product ID is required');
    }

    const product = await this.productsService.findOne(body.productId);
    if (!product) throw new NotFoundException('Product not found');
    
    // Defensively ensure qty is a valid number to prevent Mongoose validation errors
    const qty = Number(body.quantity) || 1;
    if (product.stock < qty) throw new BadRequestException('Insufficient stock');

    const userObjectId = this.toObjectId(userId);
    console.log("meri id ",userObjectId)
    // Safely retrieve or create cart to avoid race conditions and DuplicateKey 500 errors
    let cart = await this.cartModel.findOneAndUpdate(
      { userId: userObjectId },
      { $setOnInsert: { userId: userObjectId, items: [] } },
      { upsert: true, new: true }
    );

    const existingIdx = cart.items.findIndex((item: any) => {
      const pId = item.productId?.toString();
      return pId === String(body.productId) && item.size === String(body.size) && item.color === String(body.color);
    });

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += qty;
    } else {
      (cart.items as any).push({
        productId: this.toObjectId(body.productId),
        quantity: qty,
        size: body.size ? String(body.size) : 'N/A',
        color: body.color ? String(body.color) : 'N/A',
        price: Number(product.price) || 0,
        name: String(product.name) || 'Unknown Product',
        image: product.images?.[0] || '',
      });
    }

    try {
      await cart.save();
    } catch (err) {
      console.error('[CartService.addItem] Error saving cart:', err);
      throw new BadRequestException('Failed to save cart. Please check item details.');
    }
    
    console.log('[CartService.addItem] Saved cart, items count:', cart.items.length);
    return cart;
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ userId: this.toObjectId(userId) });
    if (!cart) throw new NotFoundException('Cart not found');
    const item = cart.items.find((i) => (i as any)._id.toString() === itemId);
    if (!item) throw new NotFoundException('Item not found');
    item.quantity = quantity;
    await cart.save();
    return cart;
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.cartModel.findOne({ userId: this.toObjectId(userId) });
    if (!cart) throw new NotFoundException('Cart not found');
    cart.items = cart.items.filter((i) => (i as any)._id.toString() !== itemId) as any;
    await cart.save();
    return cart;
  }

  async clearCart(userId: string) {
    return this.cartModel.findOneAndUpdate({ userId: this.toObjectId(userId) }, { items: [] }, { new: true });
  }
}
