import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all healthcare products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by keyword' })
  search(@Query('q') query: string) {
    if (!query) return this.productsService.findAll();
    return this.productsService.search(query);
  }
}
