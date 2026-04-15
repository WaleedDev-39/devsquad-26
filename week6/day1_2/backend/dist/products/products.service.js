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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
let ProductsService = class ProductsService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async findAll(query) {
        const { category, style, color, size, minPrice, maxPrice, sort = 'createdAt', page = 1, limit = 9, search, brand, } = query;
        const filter = { isActive: true };
        if (category)
            filter.$or = [{ category }, { subCategory: category }];
        if (style)
            filter.dressStyle = style;
        if (color)
            filter.colors = { $in: [color] };
        if (size)
            filter.sizes = { $in: [size] };
        if (brand)
            filter.brand = brand;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        if (search)
            filter.$text = { $search: search };
        const sortObj = {};
        if (sort === 'price-asc')
            sortObj.price = 1;
        else if (sort === 'price-desc')
            sortObj.price = -1;
        else if (sort === 'rating')
            sortObj.rating = -1;
        else if (sort === 'newest')
            sortObj.createdAt = -1;
        else
            sortObj.createdAt = -1;
        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            this.productModel.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
            this.productModel.countDocuments(filter),
        ]);
        return {
            products,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        };
    }
    async findNewArrivals(limit = 4) {
        return this.productModel.find({ isActive: true, isNewArrival: true }).sort({ createdAt: -1 }).limit(limit);
    }
    async findTopSelling(limit = 4) {
        return this.productModel.find({ isActive: true, isTopSelling: true }).sort({ reviewCount: -1 }).limit(limit);
    }
    async findOnSale(limit = 12) {
        return this.productModel.find({ isActive: true, isOnSale: true }).sort({ salePercent: -1 }).limit(limit);
    }
    async findOne(id) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async findRelated(id, limit = 4) {
        const product = await this.findOne(id);
        return this.productModel
            .find({ _id: { $ne: id }, category: product.category, isActive: true })
            .limit(limit);
    }
    async create(data) {
        return this.productModel.create(data);
    }
    async update(id, data) {
        const product = await this.productModel.findByIdAndUpdate(id, data, { new: true });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async delete(id) {
        await this.productModel.findByIdAndUpdate(id, { isActive: false });
        return { message: 'Product deleted' };
    }
    async applySale(id, salePercent) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const originalPrice = product.originalPrice || product.price;
        const newPrice = Math.round(originalPrice * (1 - salePercent / 100));
        return this.productModel.findByIdAndUpdate(id, { isOnSale: true, salePercent, originalPrice, price: newPrice }, { new: true });
    }
    async removeSale(id) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.productModel.findByIdAndUpdate(id, { isOnSale: false, salePercent: 0, price: product.originalPrice || product.price }, { new: true });
    }
    async updateRating(productId, newRating, reviewCount) {
        return this.productModel.findByIdAndUpdate(productId, { rating: newRating, reviewCount }, { new: true });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map