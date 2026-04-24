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
    toObjectId(id) {
        try {
            return new mongoose_2.Types.ObjectId(id);
        }
        catch {
            throw new common_1.BadRequestException(`Invalid ID: ${id}`);
        }
    }
    async getCart(userId) {
        let cart = await this.cartModel.findOne({ userId: this.toObjectId(userId) });
        if (!cart)
            cart = await this.cartModel.create({ userId: this.toObjectId(userId), items: [] });
        return cart;
    }
    async addItem(userId, body) {
        console.log(`[CartService.addItem] userId=${userId} productId=${body.productId} size=${body.size} color=${body.color} qty=${body.quantity}`);
        if (!body.productId) {
            throw new common_1.BadRequestException('Product ID is required');
        }
        const product = await this.productsService.findOne(body.productId);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const qty = Number(body.quantity) || 1;
        if (product.stock < qty)
            throw new common_1.BadRequestException('Insufficient stock');
        const userObjectId = this.toObjectId(userId);
        console.log("meri id ", userObjectId);
        let cart = await this.cartModel.findOneAndUpdate({ userId: userObjectId }, { $setOnInsert: { userId: userObjectId, items: [] } }, { upsert: true, new: true });
        const existingIdx = cart.items.findIndex((item) => {
            const pId = item.productId?.toString();
            return pId === String(body.productId) && item.size === String(body.size) && item.color === String(body.color);
        });
        if (existingIdx > -1) {
            cart.items[existingIdx].quantity += qty;
        }
        else {
            cart.items.push({
                productId: this.toObjectId(body.productId),
                quantity: qty,
                size: body.size ? String(body.size) : 'N/A',
                color: body.color ? String(body.color) : 'N/A',
                price: Number(product.price) || 0,
                name: String(product.name) || 'Unknown Product',
                image: product.images?.[0] || '',
            });
        }
        try {
            await cart.save();
        }
        catch (err) {
            console.error('[CartService.addItem] Error saving cart:', err);
            throw new common_1.BadRequestException('Failed to save cart. Please check item details.');
        }
        console.log('[CartService.addItem] Saved cart, items count:', cart.items.length);
        return cart;
    }
    async updateItem(userId, itemId, quantity) {
        const cart = await this.cartModel.findOne({ userId: this.toObjectId(userId) });
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
        const cart = await this.cartModel.findOne({ userId: this.toObjectId(userId) });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
        await cart.save();
        return cart;
    }
    async clearCart(userId) {
        return this.cartModel.findOneAndUpdate({ userId: this.toObjectId(userId) }, { items: [] }, { new: true });
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