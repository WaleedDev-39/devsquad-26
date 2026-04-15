import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { OrderStatus } from '../orders/schemas/order.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Define multer storage for product images
const storage = diskStorage({
  destination: './uploads/products',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  }
});

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    private notificationsGateway: NotificationsGateway,
  ) {
    this.logger.log('AdminController Initialized');
  }

  // ───── File Upload ─────
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file uploaded');
    // Return relative URL that points to the served static file
    return { imageUrl: `/uploads/products/${file.filename}` };
  }

  // ───── Products ─────
  @Get('products')
  async getAllProducts(@Query() query: any) {
    this.logger.log(`Fetching all products with query: ${JSON.stringify(query)}`);
    try {
      return await this.productsService.findAll(query);
    } catch (err) {
      this.logger.error(`Error fetching products: ${err.message}`, err.stack);
      throw err;
    }
  }

  @Post('products')
  createProduct(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  // ───── Sales ─────
  @Post('sales/apply/:id')
  async applySale(@Param('id') id: string, @Body('salePercent') salePercent: number) {
    const product = await this.productsService.applySale(id, salePercent);
    this.notificationsGateway.broadcastSaleNotification({
      productId: id,
      productName: product.name,
      salePercent,
    });
    return product;
  }

  @Delete('sales/remove/:id')
  removeSale(@Param('id') id: string) {
    return this.productsService.removeSale(id);
  }

  // ───── Orders ─────
  @Get('orders')
  async getAllOrders() {
    this.logger.log('Fetching all orders');
    try {
      return await this.ordersService.getAllOrders();
    } catch (err) {
      this.logger.error(`Error fetching orders: ${err.message}`, err.stack);
      throw err;
    }
  }

  @Patch('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  // ───── Users ─────
  @Get('users')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('users/:id/role')
  @Roles(UserRole.SUPER_ADMIN)
  updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }

  @Delete('users/:id')
  @Roles(UserRole.SUPER_ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  // ───── Categories ─────
  @Post('categories')
  createCategory(@Body() body: any) {
    return this.categoriesService.create(body);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.categoriesService.update(id, body);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }

  // ───── Dashboard Stats ─────
  @Get('stats')
  getStats() {
    return this.ordersService.getDashboardStats();
  }

  @Get('stats/graph')
  getSalesGraph() {
    return this.ordersService.getSalesGraphData();
  }

  @Get('stats/best-sellers')
  getBestSellers(@Query('limit') limit: number = 5) {
    return this.productsService.findTopSelling(limit);
  }
}
