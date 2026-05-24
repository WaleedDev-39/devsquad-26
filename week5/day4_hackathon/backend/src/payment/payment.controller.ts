import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':carId')
  makePayment(@Req() req, @Param('carId') carId: string) {
    return this.paymentService.makePayment(carId, req.user._id);
  }

  @Get(':carId')
  getStatus(@Param('carId') carId: string) {
    return this.paymentService.getPaymentStatus(carId);
  }
}
