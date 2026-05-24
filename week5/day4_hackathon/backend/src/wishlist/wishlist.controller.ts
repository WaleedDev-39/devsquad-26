import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':carId')
  toggle(@Req() req, @Param('carId') carId: string) {
    return this.wishlistService.toggleWishlist(req.user._id, carId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getWishlist(@Req() req) {
    return this.wishlistService.getWishlist(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:carId')
  check(@Req() req, @Param('carId') carId: string) {
    return this.wishlistService.checkWishlist(req.user._id, carId);
  }
}
