import { Controller, Get, Query, Param, OnModuleInit } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController implements OnModuleInit {
  constructor(private readonly productsService: ProductsService) {}

  async onModuleInit() {
    await this.productsService.seedProducts();
  }

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.productsService.findByCategory(category);
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }
}
