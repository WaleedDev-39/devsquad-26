import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  private getUserId(req: any): string {
    // Support both userId (from JwtStrategy.validate) and sub (raw JWT field)
    return req.user?.userId || req.user?.sub;
  }

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(this.getUserId(req));
  }

  @Post('add')
  addItem(@Request() req, @Body() body: any) {
    console.log('[CartController.addItem] req.user:', req.user);
    console.log('[CartController.addItem] body:', body);
    return this.cartService.addItem(this.getUserId(req), body);
  }

  @Patch('update/:itemId')
  updateItem(@Request() req, @Param('itemId') itemId: string, @Body('quantity') quantity: number) {
    return this.cartService.updateItem(this.getUserId(req), itemId, quantity);
  }

  @Delete('remove/:itemId')
  removeItem(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(this.getUserId(req), itemId);
  }

  @Delete('clear')
  clearCart(@Request() req) {
    return this.cartService.clearCart(this.getUserId(req));
  }
}
