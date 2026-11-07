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
exports.AddressesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const addresses_service_1 = require("./addresses.service");
const address_dto_1 = require("./dto/address.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AddressesController = class AddressesController {
    constructor(addressesService) {
        this.addressesService = addressesService;
    }
    async findAll(userId) {
        return this.addressesService.findAll(userId);
    }
    async findOne(userId, id) {
        return this.addressesService.findOne(userId, id);
    }
    async create(userId, dto) {
        return this.addressesService.create(userId, dto);
    }
    async update(userId, id, dto) {
        return this.addressesService.update(userId, id, dto);
    }
    async setDefault(userId, id) {
        return this.addressesService.setDefault(userId, id);
    }
    async delete(userId, id) {
        return this.addressesService.delete(userId, id);
    }
};
exports.AddressesController = AddressesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan daftar alamat pengguna yang sedang login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar alamat berhasil didapatkan' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan detail alamat' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Menambahkan alamat pengiriman baru' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alamat berhasil ditambahkan' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, address_dto_1.CreateAddressDto]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Memperbarui data alamat' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alamat berhasil diperbarui' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, address_dto_1.UpdateAddressDto]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/default'),
    (0, swagger_1.ApiOperation)({ summary: 'Menjadikan alamat ini sebagai alamat default utama' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alamat default berhasil diset' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "setDefault", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Menghapus alamat' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alamat berhasil dihapus' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "delete", null);
exports.AddressesController = AddressesController = __decorate([
    (0, swagger_1.ApiTags)('Customer Addresses'),
    (0, common_1.Controller)('addresses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [addresses_service_1.AddressesService])
], AddressesController);
//# sourceMappingURL=addresses.controller.js.map