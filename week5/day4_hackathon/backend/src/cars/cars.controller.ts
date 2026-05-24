import {
  Controller, Get, Post, Patch, Param, Query, Body,
  UseGuards, Req, UseInterceptors, UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const storage = diskStorage({
  destination: './uploads/cars',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.carsService.findAll(query);
  }

  @Get('trending')
  findTrending() {
    return this.carsService.findTrending();
  }

  @Get('live')
  findLive() {
    return this.carsService.findLiveAuctions();
  }

  @Get('makes')
  getMakes() {
    return this.carsService.getDistinctMakes();
  }

  @Get('models')
  getModels(@Query('make') make?: string) {
    return this.carsService.getDistinctModels(make);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.carsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('photos', 10, { storage }))
  async create(@Req() req, @Body() body: any, @UploadedFiles() files: Express.Multer.File[]) {
    const photos = files ? files.map((f) => `/uploads/cars/${f.filename}`) : [];
    const carData = {
      ...body,
      photos,
      year: Number(body.year),
      startingBid: Number(body.startingBid),
      mileage: body.mileage ? Number(body.mileage) : undefined,
      minIncrement: body.minIncrement ? Number(body.minIncrement) : 100,
      isTrending: body.isTrending === 'true',
      isModified: body.isModified === 'true',
      endTime: body.endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    return this.carsService.create(carData, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/end')
  endAuction(@Req() req, @Param('id') id: string) {
    return this.carsService.endAuction(id, req.user._id);
  }
}
