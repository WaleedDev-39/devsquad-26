import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from '../schemas/car.schema';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async create(carData: any, sellerId: string) {
    const lotNumber = Math.floor(100000 + Math.random() * 900000);
    const car = await this.carModel.create({
      ...carData,
      seller: sellerId,
      currentBid: carData.startingBid,
      lotNumber,
    });
    return car;
  }

  async findAll(query: any) {
    const {
      page = 1,
      limit = 10,
      make,
      model,
      year,
      minPrice,
      maxPrice,
      category,
      color,
      style,
      search,
      sort = 'createdAt',
      status,
    } = query;

    const filter: any = {};

    if (make) filter.make = { $regex: make, $options: 'i' };
    if (model) filter.model = { $regex: model, $options: 'i' };
    if (year) filter.year = Number(year);
    if (category) filter.category = category;
    if (color) filter.color = { $regex: color, $options: 'i' };
    if (style) filter.category = style;
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ['active', 'ended', 'sold'] };
    }

    if (minPrice || maxPrice) {
      filter.currentBid = {};
      if (minPrice) filter.currentBid.$gte = Number(minPrice);
      if (maxPrice) filter.currentBid.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortObj: any = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { currentBid: 1 };
    if (sort === 'price_desc') sortObj = { currentBid: -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };
    if (sort === 'ending_soon') sortObj = { endTime: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await this.carModel.countDocuments(filter);
    const cars = await this.carModel
      .find(filter)
      .populate('seller', 'fullName username avatar')
      .populate('winner', 'fullName username avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    return {
      cars,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async findOne(id: string) {
    const car = await this.carModel
      .findById(id)
      .populate('seller', 'fullName username email mobileNumber nationality idType avatar')
      .populate('winner', 'fullName username email mobileNumber nationality idType avatar');
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async findByUser(userId: string) {
    return this.carModel
      .find({ seller: userId })
      .populate('winner', 'fullName username avatar')
      .sort({ createdAt: -1 });
  }

  async findTrending() {
    return this.carModel
      .find({ isTrending: true, status: 'active' })
      .populate('seller', 'fullName username avatar')
      .limit(8)
      .sort({ createdAt: -1 });
  }

  async findLiveAuctions() {
    return this.carModel
      .find({ status: 'active', endTime: { $gt: new Date() } })
      .populate('seller', 'fullName username avatar')
      .limit(8)
      .sort({ createdAt: -1 });
  }

  async endAuction(carId: string, sellerId: string) {
    const car = await this.carModel.findOne({ _id: carId, seller: sellerId });
    if (!car) throw new NotFoundException('Car not found or unauthorized');
    car.status = 'ended';
    await car.save();
    return car;
  }

  async getDistinctMakes() {
    return this.carModel.distinct('make');
  }

  async getDistinctModels(make?: string) {
    const filter = make ? { make: { $regex: make, $options: 'i' } } : {};
    return this.carModel.distinct('model', filter);
  }
}
