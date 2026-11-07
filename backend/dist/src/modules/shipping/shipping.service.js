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
exports.ShippingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let ShippingService = class ShippingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        const zones = await this.prisma.shippingZone.findMany({
            where,
            orderBy: { rate: 'asc' },
        });
        return {
            message: 'Daftar zona pengiriman berhasil dimuat',
            data: zones,
        };
    }
    async findOne(id) {
        const zone = await this.prisma.shippingZone.findUnique({
            where: { id },
        });
        if (!zone) {
            throw new common_1.NotFoundException('Zona pengiriman tidak ditemukan');
        }
        return {
            message: 'Detail zona pengiriman berhasil dimuat',
            data: zone,
        };
    }
    async create(dto) {
        const zone = await this.prisma.shippingZone.create({
            data: {
                name: dto.name.trim(),
                description: dto.description?.trim() || null,
                rate: dto.rate,
                isActive: dto.isActive !== undefined ? dto.isActive : true,
            },
        });
        return {
            message: 'Zona pengiriman berhasil ditambahkan',
            data: zone,
        };
    }
    async update(id, dto) {
        const zone = await this.prisma.shippingZone.findUnique({ where: { id } });
        if (!zone) {
            throw new common_1.NotFoundException('Zona pengiriman tidak ditemukan');
        }
        const updated = await this.prisma.shippingZone.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name.trim() }),
                ...(dto.description !== undefined && { description: dto.description?.trim() || null }),
                ...(dto.rate !== undefined && { rate: dto.rate }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });
        return {
            message: 'Zona pengiriman berhasil diperbarui',
            data: updated,
        };
    }
    async delete(id) {
        const zone = await this.prisma.shippingZone.findUnique({ where: { id } });
        if (!zone) {
            throw new common_1.NotFoundException('Zona pengiriman tidak ditemukan');
        }
        const orderCount = await this.prisma.order.count({ where: { shippingZoneId: id } });
        if (orderCount > 0) {
            await this.prisma.shippingZone.update({
                where: { id },
                data: { isActive: false },
            });
            return {
                message: 'Zona dinonaktifkan karena telah terhubung ke transaksi masa lalu',
                data: { deactivated: true },
            };
        }
        await this.prisma.shippingZone.delete({ where: { id } });
        return {
            message: 'Zona pengiriman berhasil dihapus',
            data: { deleted: true },
        };
    }
};
exports.ShippingService = ShippingService;
exports.ShippingService = ShippingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShippingService);
//# sourceMappingURL=shipping.service.js.map