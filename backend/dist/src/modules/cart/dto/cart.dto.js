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
exports.UpdateCartItemQuantityDto = exports.AddCartItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddCartItemDto {
}
exports.AddCartItemDto = AddCartItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cuid_variant_id', description: 'ID varian produk yang dipilih' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Varian produk wajib dipilih' }),
    __metadata("design:type", String)
], AddCartItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, default: 1, description: 'Jumlah item yang ingin ditambahkan' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Jumlah minimal adalah 1' }),
    __metadata("design:type", Number)
], AddCartItemDto.prototype, "quantity", void 0);
class UpdateCartItemQuantityDto {
}
exports.UpdateCartItemQuantityDto = UpdateCartItemQuantityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Jumlah kuantitas baru' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Jumlah minimal adalah 1' }),
    __metadata("design:type", Number)
], UpdateCartItemQuantityDto.prototype, "quantity", void 0);
//# sourceMappingURL=cart.dto.js.map