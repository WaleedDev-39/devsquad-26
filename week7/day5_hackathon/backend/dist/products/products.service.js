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
const raw_material_schema_1 = require("../raw-materials/schemas/raw-material.schema");
let ProductsService = class ProductsService {
    productModel;
    rawMaterialModel;
    constructor(productModel, rawMaterialModel) {
        this.productModel = productModel;
        this.rawMaterialModel = rawMaterialModel;
    }
    async create(dto) {
        const created = new this.productModel(dto);
        return created.save();
    }
    async findAll() {
        const products = await this.productModel
            .find()
            .populate('recipe.rawMaterial')
            .sort({ name: 1 })
            .exec();
        return Promise.all(products.map((p) => this.enrichWithStock(p)));
    }
    async findOne(id) {
        const product = await this.productModel
            .findById(id)
            .populate('recipe.rawMaterial')
            .exec();
        if (!product)
            throw new common_1.NotFoundException(`Product #${id} not found`);
        return this.enrichWithStock(product);
    }
    async update(id, dto) {
        const updated = await this.productModel
            .findByIdAndUpdate(id, dto, { new: true })
            .populate('recipe.rawMaterial')
            .exec();
        if (!updated)
            throw new common_1.NotFoundException(`Product #${id} not found`);
        return updated;
    }
    async remove(id) {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException(`Product #${id} not found`);
    }
    enrichWithStock(product) {
        const obj = product.toObject();
        if (!obj.recipe || obj.recipe.length === 0) {
            obj.availableStock = 0;
            obj.canMake = false;
            return obj;
        }
        let maxUnits = Infinity;
        for (const ingredient of obj.recipe) {
            const rawMat = ingredient.rawMaterial;
            if (!rawMat || ingredient.quantity <= 0)
                continue;
            const possible = Math.floor(rawMat.currentStock / ingredient.quantity);
            if (possible < maxUnits)
                maxUnits = possible;
        }
        if (maxUnits === Infinity)
            maxUnits = 0;
        obj.availableStock = maxUnits;
        obj.canMake = maxUnits > 0;
        return obj;
    }
    async deductStockForSale(productId, quantitySold) {
        const product = await this.productModel
            .findById(productId)
            .populate('recipe.rawMaterial')
            .exec();
        if (!product)
            throw new common_1.NotFoundException(`Product #${productId} not found`);
        for (const ingredient of product.recipe) {
            const rawMat = ingredient.rawMaterial;
            const required = ingredient.quantity * quantitySold;
            if (rawMat.currentStock < required) {
                throw new common_1.BadRequestException(`Insufficient stock of "${rawMat.name}": need ${required} ${rawMat.unit}, have ${rawMat.currentStock} ${rawMat.unit}`);
            }
        }
        for (const ingredient of product.recipe) {
            const rawMat = ingredient.rawMaterial;
            const deduction = ingredient.quantity * quantitySold;
            await this.rawMaterialModel.findByIdAndUpdate(rawMat._id, {
                $inc: { currentStock: -deduction },
            });
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(raw_material_schema_1.RawMaterial.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map