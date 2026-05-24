import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  placeBid(@Req() req, @Body() body: { carId: string; amount: number }) {
    return this.bidsService.placeBid(body.carId, req.user._id, body.amount);
  }

  @Get('car/:carId')
  getBidsForCar(@Param('carId') carId: string) {
    return this.bidsService.getBidsForCar(carId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/me')
  getUserBids(@Req() req) {
    return this.bidsService.getUserBids(req.user._id);
  }
}
