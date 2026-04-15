import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from '../schemas/bid.schema';
import { Car, CarDocument } from '../schemas/car.schema';
import { AppGateway } from '../gateway/app.gateway';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private gateway: AppGateway,
  ) {}

  async placeBid(carId: string, bidderId: string, amount: number) {
    const car = await this.carModel.findById(carId);
    if (!car) throw new BadRequestException('Car not found');

    if (car.status !== 'active') {
      throw new BadRequestException('This auction has ended');
    }

    if (new Date() > new Date(car.endTime)) {
      throw new BadRequestException('This auction has expired');
    }

    // Users cannot bid on their own cars
    if (car.seller.toString() === bidderId) {
      throw new ForbiddenException('You cannot bid on your own car');
    }

    if (amount <= car.currentBid) {
      throw new BadRequestException(`Bid must be higher than current bid of $${car.currentBid}`);
    }

    if (amount < car.currentBid + car.minIncrement) {
      throw new BadRequestException(`Minimum bid increment is $${car.minIncrement}`);
    }

    const bid = await this.bidModel.create({
      car: carId,
      bidder: bidderId,
      amount,
    });

    // Update car's current bid and total bids
    car.currentBid = amount;
    car.totalBids += 1;
    car.winner = bidderId as any;
    await car.save();

    // Populate bidder info
    const populatedBid = await this.bidModel
      .findById(bid._id)
      .populate('bidder', 'fullName username avatar email');

    // Emit real-time bid update
    this.gateway.emitBidUpdate(carId, {
      bid: populatedBid,
      currentBid: car.currentBid,
      totalBids: car.totalBids,
    });

    // Emit notification
    this.gateway.emitNotification({
      type: 'new_bid',
      message: `New bid of $${amount.toLocaleString()} on ${car.title}`,
      carId,
      carTitle: car.title,
      amount,
    });

    return { bid: populatedBid, car };
  }

  async getBidsForCar(carId: string) {
    return this.bidModel
      .find({ car: carId })
      .populate('bidder', 'fullName username avatar email mobileNumber nationality idType')
      .sort({ amount: -1 });
  }

  async getUserBids(userId: string) {
    const bids = await this.bidModel
      .find({ bidder: userId })
      .populate({
        path: 'car',
        populate: { path: 'seller', select: 'fullName username' },
      })
      .sort({ createdAt: -1 });

    // Group by car and get highest bid per car
    const carMap = new Map();
    bids.forEach((bid) => {
      const carId = (bid.car as any)._id.toString();
      if (!carMap.has(carId) || bid.amount > carMap.get(carId).amount) {
        carMap.set(carId, bid);
      }
    });

    return Array.from(carMap.values());
  }
}
