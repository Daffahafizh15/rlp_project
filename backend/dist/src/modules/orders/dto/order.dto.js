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
exports.GetOrdersFilterDto = exports.UpdateOrderStatusDto = exports.CreateOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cuid_address_id', description: 'ID alamat pengiriman customer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Alamat pengiriman wajib dipilih' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "addressId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PaymentMethod, example: client_1.PaymentMethod.BANK_TRANSFER, description: 'Metode pembayaran (BANK_TRANSFER atau QRIS)' }),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod, { message: 'Metode pembayaran harus BANK_TRANSFER atau QRIS' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Tolong packing ekstra rapi', description: 'Catatan tambahan pesanan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "notes", void 0);
class UpdateOrderStatusDto {
}
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.OrderStatus, example: client_1.OrderStatus.PROCESSING }),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus, { message: 'Status pesanan tidak valid' }),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'JNE-REG-9876543210', description: 'Nomor resi kurir (wajib saat status SHIPPED)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "trackingNumber", void 0);
class GetOrdersFilterDto {
}
exports.GetOrdersFilterDto = GetOrdersFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.OrderStatus, description: 'Filter status pesanan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus),
    __metadata("design:type", String)
], GetOrdersFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pencarian nomor pesanan atau nama customer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetOrdersFilterDto.prototype, "search", void 0);
//# sourceMappingURL=order.dto.js.map