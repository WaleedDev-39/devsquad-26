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
exports.RawMaterialsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const raw_material_schema_1 = require("./schemas/raw-material.schema");
let RawMaterialsService = class RawMaterialsService {
    rawMaterialModel;
    constructor(rawMaterialModel) {
        this.rawMaterialModel = rawMaterialModel;
    }
    async create(dto) {
        const created = new this.rawMaterialModel(dto);
        return created.save();
    }
    async findAll() {
        return this.rawMaterialModel.find().sort({ name: 1 }).exec();
    }
    async findOne(id) {
        const mat = await this.rawMaterialModel.findById(id).exec();
        if (!mat)
            throw new common_1.NotFoundException(`Raw material #${id} not found`);
        return mat;
    }
    async update(id, dto) {
        const updated = await this.rawMaterialModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
        if (!updated)
            throw new common_1.NotFoundException(`Raw material #${id} not found`);
        return updated;
    }
    async restock(id, dto) {
        const mat = await this.rawMaterialModel.findById(id).exec();
        if (!mat)
            throw new common_1.NotFoundException(`Raw material #${id} not found`);
        mat.currentStock += dto.quantity;
        return mat.save();
    }
    async remove(id) {
        const result = await this.rawMaterialModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException(`Raw material #${id} not found`);
    }
    async getLowStockMaterials() {
        return this.rawMaterialModel
            .find({
            $expr: {
                $and: [
                    { $gt: ['$minimumStockAlert', 0] },
                    { $lte: ['$currentStock', '$minimumStockAlert'] },
                ],
            },
        })
            .exec();
    }
};
exports.RawMaterialsService = RawMaterialsService;
exports.RawMaterialsService = RawMaterialsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(raw_material_schema_1.RawMaterial.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RawMaterialsService);
//# sourceMappingURL=raw-materials.service.js.map