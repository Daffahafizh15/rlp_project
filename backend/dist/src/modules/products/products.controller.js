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
exports.AdminProductsController = exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("./products.service");
const product_dto_1 = require("./dto/product.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findAll(filter) {
        return this.productsService.findAll(filter);
    }
    async findOne(identifier) {
        return this.productsService.findOne(identifier);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Katalog publik FORME (Dapat diakses oleh Guest tanpa login)',
        description: 'Menampilkan daftar produk dengan ringkasan harga, thumbnail foto, varian ukuran/warna yang tersedia, serta filter pencarian dan kategori.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Katalog produk berhasil didapatkan' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.GetProductsFilterDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':identifier'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Detail produk lengkap (Wajib Login: Customer & Admin)',
        description: 'Halaman detail produk hanya dapat diakses setelah login. Mengembalikan deskripsi lengkap, galeri multi-foto, varian warna/ukuran, dan ketersediaan stok.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detail produk berhasil didapatkan' }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Akses ditolak: Guest harus login terlebih dahulu untuk melihat detail produk.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produk tidak ditemukan' }),
    __param(0, (0, common_1.Param)('identifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
let AdminProductsController = class AdminProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findAdminProduct(id) {
        return this.productsService.findAdminProduct(id);
    }
    async create(dto) {
        return this.productsService.create(dto);
    }
    async update(id, dto) {
        return this.productsService.update(id, dto);
    }
    async updateStock(variantId, dto) {
        return this.productsService.updateVariantStock(variantId, dto.stock);
    }
    async delete(id) {
        return this.productsService.delete(id);
    }
};
exports.AdminProductsController = AdminProductsController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan data produk untuk form edit Admin (Khusus Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "findAdminProduct", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Menambahkan produk baru lengkap dengan varian dan foto (Khusus Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Produk berhasil dibuat' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Memperbarui informasi produk (Khusus Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produk berhasil diperbarui' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('variants/:variantId/stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Memperbarui stok varian secara langsung (Khusus Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stok varian berhasil diubah' }),
    __param(0, (0, common_1.Param)('variantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_dto_1.UpdateStockDto]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Menghapus atau menonaktifkan produk (Khusus Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produk berhasil dihapus atau dinonaktifkan' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "delete", null);
exports.AdminProductsController = AdminProductsController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Product Management'),
    (0, common_1.Controller)('admin/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], AdminProductsController);
//# sourceMappingURL=products.controller.js.map