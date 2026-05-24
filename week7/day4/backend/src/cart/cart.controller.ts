import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { CartService, CartItem } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':sessionId')
  getCart(@Param('sessionId') sessionId: string) {
    return this.cartService.getCart(sessionId);
  }

  @Post(':sessionId/items')
  addItem(@Param('sessionId') sessionId: string, @Body() item: CartItem) {
    return this.cartService.addItem(sessionId, item);
  }

  @Patch(':sessionId/items/:productId')
  updateItem(
    @Param('sessionId') sessionId: string,
    @Param('productId') productId: string,
    @Body() body: { quantity: number; size?: string; color?: string },
  ) {
    return this.cartService.updateItem(sessionId, productId, body.quantity, body.size, body.color);
  }

  @Delete(':sessionId/items/:productId')
  removeItem(
    @Param('sessionId') sessionId: string,
    @Param('productId') productId: string,
    @Query('size') size?: string,
    @Query('color') color?: string,
  ) {
    return this.cartService.removeItem(sessionId, productId, size, color);
  }

  @Delete(':sessionId')
  clearCart(@Param('sessionId') sessionId: string) {
    return this.cartService.clearCart(sessionId);
  }
}
