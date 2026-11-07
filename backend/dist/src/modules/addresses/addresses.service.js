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
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let AddressesService = class AddressesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        const addresses = await this.prisma.address.findMany({
            where: { userId },
            include: { shippingZone: true },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
        return {
            message: 'Daftar alamat berhasil dimuat',
            data: addresses,
        };
    }
    async findOne(userId, addressId) {
        const address = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
            include: { shippingZone: true },
        });
        if (!address) {
            throw new common_1.NotFoundException('Alamat tidak ditemukan');
        }
        return {
            message: 'Detail alamat berhasil dimuat',
            data: address,
        };
    }
    async create(userId, dto) {
        const existingCount = await this.prisma.address.count({ where: { userId } });
        const isDefault = dto.isDefault || existingCount === 0;
        if (isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }
        const address = await this.prisma.address.create({
            data: {
                userId,
                label: dto.label.trim(),
                recipientName: dto.recipientName.trim(),
                phoneNumber: dto.phoneNumber.trim(),
                fullAddress: dto.fullAddress.trim(),
                city: dto.city.trim(),
                province: dto.province.trim(),
                postalCode: dto.postalCode.trim(),
                shippingZoneId: dto.shippingZoneId,
                isDefault,
            },
            include: { shippingZone: true },
        });
        return {
            message: 'Alamat pengiriman berhasil ditambahkan',
            data: address,
        };
    }
    async update(userId, addressId, dto) {
        const existing = await this.prisma.address.findUnique({ where: { id: addressId } });
        if (!existing) {
            throw new common_1.NotFoundException('Alamat tidak ditemukan');
        }
        if (existing.userId !== userId) {
            throw new common_1.ForbiddenException('Akses ditolak: Alamat ini bukan milik Anda');
        }
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }
        const updated = await this.prisma.address.update({
            where: { id: addressId },
            data: {
                ...(dto.label && { label: dto.label.trim() }),
                ...(dto.recipientName && { recipientName: dto.recipientName.trim() }),
                ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber.trim() }),
                ...(dto.fullAddress && { fullAddress: dto.fullAddress.trim() }),
                ...(dto.city && { city: dto.city.trim() }),
                ...(dto.province && { province: dto.province.trim() }),
                ...(dto.postalCode && { postalCode: dto.postalCode.trim() }),
                ...(dto.shippingZoneId && { shippingZoneId: dto.shippingZoneId }),
                ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
            },
            include: { shippingZone: true },
        });
        return {
            message: 'Alamat pengiriman berhasil diperbarui',
            data: updated,
        };
    }
    async setDefault(userId, addressId) {
        const existing = await this.prisma.address.findUnique({ where: { id: addressId } });
        if (!existing || existing.userId !== userId) {
            throw new common_1.NotFoundException('Alamat tidak ditemukan');
        }
        await this.prisma.$transaction([
            this.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            }),
            this.prisma.address.update({
                where: { id: addressId },
                data: { isDefault: true },
            }),
        ]);
        return {
            message: 'Alamat utama berhasil diatur',
            data: { id: addressId, isDefault: true },
        };
    }
    async delete(userId, addressId) {
        const existing = await this.prisma.address.findUnique({ where: { id: addressId } });
        if (!existing) {
            throw new common_1.NotFoundException('Alamat tidak ditemukan');
        }
        if (existing.userId !== userId) {
            throw new common_1.ForbiddenException('Akses ditolak: Alamat ini bukan milik Anda');
        }
        await this.prisma.address.delete({ where: { id: addressId } });
        if (existing.isDefault) {
            const nextAddress = await this.prisma.address.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
            if (nextAddress) {
                await this.prisma.address.update({
                    where: { id: nextAddress.id },
                    data: { isDefault: true },
                });
            }
        }
        return {
            message: 'Alamat pengiriman berhasil dihapus',
            data: null,
        };
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map