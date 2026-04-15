import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from '../schemas/car.schema';
import { AppGateway } from '../gateway/app.gateway';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private gateway: AppGateway,
  ) {}

  async makePayment(carId: string, userId: string) {
    const car = await this.carModel.findById(carId);
    if (!car) throw new BadRequestException('Car not found');

    if (car.winner?.toString() !== userId) {
      throw new ForbiddenException('Only the auction winner can make payment');
    }

    if (car.paymentStatus !== 'pending') {
      throw new BadRequestException('Payment already processed');
    }

    car.paymentStatus = 'paid';
    car.status = 'sold';
    car.paymentDate = new Date();
    car.expectedDeliveryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await car.save();

    // Start shipping simulation - auto progress every 60 seconds
    this.startShippingSimulation(carId, userId);

    return car;
  }

  async getPaymentStatus(carId: string) {
    const car = await this.carModel
      .findById(carId)
      .populate('winner', 'fullName username email mobileNumber nationality idType avatar')
      .populate('seller', 'fullName username email');
    if (!car) throw new BadRequestException('Car not found');
    return car;
  }

  private startShippingSimulation(carId: string, userId: string) {
    // After 60 seconds: shipping
    setTimeout(async () => {
      const car = await this.carModel.findById(carId);
      if (car && car.paymentStatus === 'paid') {
        car.paymentStatus = 'shipping';
        await car.save();
        this.gateway.emitShippingUpdate(carId, userId, {
          status: 'shipping',
          message: 'Ready for shipping',
        });
      }
    }, 60000);

    // After 120 seconds: in_transit
    setTimeout(async () => {
      const car = await this.carModel.findById(carId);
      if (car && car.paymentStatus === 'shipping') {
        car.paymentStatus = 'in_transit';
        await car.save();
        this.gateway.emitShippingUpdate(carId, userId, {
          status: 'in_transit',
          message: 'In transit',
        });
      }
    }, 120000);

    // After 180 seconds: delivered
    setTimeout(async () => {
      const car = await this.carModel.findById(carId);
      if (car && car.paymentStatus === 'in_transit') {
        car.paymentStatus = 'delivered';
        car.status = 'delivered';
        await car.save();
        this.gateway.emitShippingUpdate(carId, userId, {
          status: 'delivered',
          message: 'Vehicle delivered',
        });
        this.gateway.emitNotification({
          type: 'bid_ended',
          message: `Auction for ${car.title} has been completed. Vehicle delivered!`,
          carId,
          carTitle: car.title,
        });
      }
    }, 180000);
  }
}
