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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("./schemas/cart.schema");
const products_service_1 = require("../products/products.service");
let CartService = class CartService {
    constructor(cartModel, productsService) {
        this.cartModel = cartModel;
        this.productsService = productsService;
    }
    async getCart(userId) {
        let cart = await this.cartModel.findOne({ userId }).populate('items.productId');
        if (!cart)
            cart = await this.cartModel.create({ userId, items: [] });
        return cart;
    }
    async addItem(userId, body) {
        const product = await this.productsService.findOne(body.productId);
        if (product.stock < body.quantity)
            throw new common_1.BadRequestException('Insufficient stock');
        let cart = await this.cartModel.findOne({ userId });
        if (!cart)
            cart = await this.cartModel.create({ userId, items: [] });
        const existingIdx = cart.items.findIndex((i) => i.productId.toString() === body.productId && i.size === body.size && i.color === body.color);
        if (existingIdx > -1) {
            cart.items[existingIdx].quantity += body.quantity;
        }
        else {
            cart.items.push({
                productId: new mongoose_2.Types.ObjectId(body.productId),
                quantity: body.quantity,
                size: body.size,
                color: body.color,
                price: product.price,
                name: product.name,
                image: product.images?.[0] || '',
            });
        }
        await cart.save();
        return cart;
    }
    async updateItem(userId, itemId, quantity) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        const item = cart.items.find((i) => i._id.toString() === itemId);
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        item.quantity = quantity;
        await cart.save();
        return cart;
    }
    async removeItem(userId, itemId) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
        await cart.save();
        return cart;
    }
    async clearCart(userId) {
        return this.cartModel.findOneAndUpdate({ userId }, { items: [] }, { new: true });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService])
], CartService);
//# sourceMappingURL=cart.service.js.map