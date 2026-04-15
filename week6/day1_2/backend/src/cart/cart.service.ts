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

  async getCart(userId: string) {
    let cart = await this.cartModel.findOne({ userId }).populate('items.productId');
    if (!cart) cart = await this.cartModel.create({ userId, items: [] });
    return cart;
  }

  async addItem(userId: string, body: { productId: string; quantity: number; size: string; color: string }) {
    const product = await this.productsService.findOne(body.productId);
    if (product.stock < body.quantity) throw new BadRequestException('Insufficient stock');

    let cart = await this.cartModel.findOne({ userId });
    if (!cart) cart = await this.cartModel.create({ userId, items: [] });

    const existingIdx = cart.items.findIndex(
      (i) => i.productId.toString() === body.productId && i.size === body.size && i.color === body.color,
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += body.quantity;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(body.productId),
        quantity: body.quantity,
        size: body.size,
        color: body.color,
        price: product.price,
        name: product.name,
        image: product.images?.[0] || '',
      } as any);
    }

    await cart.save();
    return cart;
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');
    const item = cart.items.find((i) => (i as any)._id.toString() === itemId);
    if (!item) throw new NotFoundException('Item not found');
    item.quantity = quantity;
    await cart.save();
    return cart;
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');
    cart.items = cart.items.filter((i) => (i as any)._id.toString() !== itemId) as any;
    await cart.save();
    return cart;
  }

  async clearCart(userId: string) {
    return this.cartModel.findOneAndUpdate({ userId }, { items: [] }, { new: true });
  }
}
