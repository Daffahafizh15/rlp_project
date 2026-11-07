import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateShippingZoneDto, UpdateShippingZoneDto } from './dto/shipping-zone.dto';

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(id: string) {
    const zone = await this.prisma.shippingZone.findUnique({
      where: { id },
    });

    if (!zone) {
      throw new NotFoundException('Zona pengiriman tidak ditemukan');
    }

    return {
      message: 'Detail zona pengiriman berhasil dimuat',
      data: zone,
    };
  }

  async create(dto: CreateShippingZoneDto) {
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

  async update(id: string, dto: UpdateShippingZoneDto) {
    const zone = await this.prisma.shippingZone.findUnique({ where: { id } });
    if (!zone) {
      throw new NotFoundException('Zona pengiriman tidak ditemukan');
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

  async delete(id: string) {
    const zone = await this.prisma.shippingZone.findUnique({ where: { id } });
    if (!zone) {
      throw new NotFoundException('Zona pengiriman tidak ditemukan');
    }

    // Soft delete if referenced in orders
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
}
