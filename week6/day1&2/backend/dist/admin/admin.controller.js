"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AdminController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const products_service_1 = require("../products/products.service");
const orders_service_1 = require("../orders/orders.service");
const users_service_1 = require("../users/users.service");
const categories_service_1 = require("../categories/categories.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const order_schema_1 = require("../orders/schemas/order.schema");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const storage = (0, multer_1.diskStorage)({
    destination: './uploads/products',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
    }
});
let AdminController = AdminController_1 = class AdminController {
    constructor(productsService, ordersService, usersService, categoriesService, notificationsGateway) {
        this.productsService = productsService;
        this.ordersService = ordersService;
        this.usersService = usersService;
        this.categoriesService = categoriesService;
        this.notificationsGateway = notificationsGateway;
        this.logger = new common_1.Logger(AdminController_1.name);
        this.logger.log('AdminController Initialized');
    }
    uploadFile(file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        return { imageUrl: `/uploads/products/${file.filename}` };
    }
    async getAllProducts(query) {
        this.logger.log(`Fetching all products with query: ${JSON.stringify(query)}`);
        try {
            return await this.productsService.findAll(query);
        }
        catch (err) {
            this.logger.error(`Error fetching products: ${err.message}`, err.stack);
            throw err;
        }
    }
    createProduct(body) {
        return this.productsService.create(body);
    }
    updateProduct(id, body) {
        return this.productsService.update(id, body);
    }
    deleteProduct(id) {
        return this.productsService.delete(id);
    }
    async applySale(id, salePercent) {
        const product = await this.productsService.applySale(id, salePercent);
        this.notificationsGateway.broadcastSaleNotification({
            productId: id,
            productName: product.name,
            salePercent,
        });
        return product;
    }
    removeSale(id) {
        return this.productsService.removeSale(id);
    }
    async getAllOrders() {
        this.logger.log('Fetching all orders');
        try {
            return await this.ordersService.getAllOrders();
        }
        catch (err) {
            this.logger.error(`Error fetching orders: ${err.message}`, err.stack);
            throw err;
        }
    }
    updateOrderStatus(id, status) {
        return this.ordersService.updateOrderStatus(id, status);
    }
    getAllUsers() {
        return this.usersService.findAll();
    }
    getUser(id) {
        return this.usersService.findOne(id);
    }
    updateUserRole(id, role) {
        return this.usersService.updateRole(id, role);
    }
    deleteUser(id) {
        return this.usersService.deleteUser(id);
    }
    createCategory(body) {
        return this.categoriesService.create(body);
    }
    updateCategory(id, body) {
        return this.categoriesService.update(id, body);
    }
    deleteCategory(id) {
        return this.categoriesService.delete(id);
    }
    getStats() {
        return this.ordersService.getDashboardStats();
    }
    getSalesGraph() {
        return this.ordersService.getSalesGraphData();
    }
    getBestSellers(limit = 5) {
        return this.productsService.findTopSelling(limit);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Post)('sales/apply/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('salePercent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "applySale", null);
__decorate([
    (0, common_1.Delete)('sales/remove/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "removeSale", null);
__decorate([
    (0, common_1.Get)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('stats/graph'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSalesGraph", null);
__decorate([
    (0, common_1.Get)('stats/best-sellers'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getBestSellers", null);
exports.AdminController = AdminController = AdminController_1 = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        orders_service_1.OrdersService,
        users_service_1.UsersService,
        categories_service_1.CategoriesService,
        notifications_gateway_1.NotificationsGateway])
], AdminController);
//# sourceMappingURL=admin.controller.js.map