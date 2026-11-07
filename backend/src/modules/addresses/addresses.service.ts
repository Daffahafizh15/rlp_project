import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
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

  async findOne(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
      include: { shippingZone: true },
    });

    if (!address) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }

    return {
      message: 'Detail alamat berhasil dimuat',
      data: address,
    };
  }

  async create(userId: string, dto: CreateAddressDto) {
    // If marked default or first address, reset existing defaults
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

  async update(userId: string, addressId: string, dto: UpdateAddressDto) {
    const existing = await this.prisma.address.findUnique({ where: { id: addressId } });
    if (!existing) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('Akses ditolak: Alamat ini bukan milik Anda');
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

  async setDefault(userId: string, addressId: string) {
    const existing = await this.prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Alamat tidak ditemukan');
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

  async delete(userId: string, addressId: string) {
    const existing = await this.prisma.address.findUnique({ where: { id: addressId } });
    if (!existing) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('Akses ditolak: Alamat ini bukan milik Anda');
    }

    await this.prisma.address.delete({ where: { id: addressId } });

    // If deleted address was default, promote another if exists
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
}
