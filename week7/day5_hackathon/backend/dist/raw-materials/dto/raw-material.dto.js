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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestockRawMaterialDto = exports.UpdateRawMaterialDto = exports.CreateRawMaterialDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRawMaterialDto {
    name;
    unit;
    currentStock;
    minimumStockAlert;
}
exports.CreateRawMaterialDto = CreateRawMaterialDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRawMaterialDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['g', 'ml', 'pcs', 'kg', 'l', 'oz']),
    __metadata("design:type", String)
], CreateRawMaterialDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateRawMaterialDto.prototype, "currentStock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateRawMaterialDto.prototype, "minimumStockAlert", void 0);
class UpdateRawMaterialDto {
    name;
    unit;
    currentStock;
    minimumStockAlert;
}
exports.UpdateRawMaterialDto = UpdateRawMaterialDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRawMaterialDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['g', 'ml', 'pcs', 'kg', 'l', 'oz']),
    __metadata("design:type", String)
], UpdateRawMaterialDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateRawMaterialDto.prototype, "currentStock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateRawMaterialDto.prototype, "minimumStockAlert", void 0);
class RestockRawMaterialDto {
    quantity;
}
exports.RestockRawMaterialDto = RestockRawMaterialDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RestockRawMaterialDto.prototype, "quantity", void 0);
//# sourceMappingURL=raw-material.dto.js.map