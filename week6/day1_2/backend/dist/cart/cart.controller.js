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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    getUserId(req) {
        return req.user?.userId || req.user?.sub;
    }
    getCart(req) {
        return this.cartService.getCart(this.getUserId(req));
    }
    addItem(req, body) {
        console.log('[CartController.addItem] req.user:', req.user);
        console.log('[CartController.addItem] body:', body);
        return this.cartService.addItem(this.getUserId(req), body);
    }
    updateItem(req, itemId, quantity) {
        return this.cartService.updateItem(this.getUserId(req), itemId, quantity);
    }
    removeItem(req, itemId) {
        return this.cartService.removeItem(this.getUserId(req), itemId);
    }
    clearCart(req) {
        return this.cartService.clearCart(this.getUserId(req));
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('update/:itemId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('remove/:itemId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)('clear'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map