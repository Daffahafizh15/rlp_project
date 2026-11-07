import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      message: 'Daftar kategori berhasil dimuat',
      data: categories,
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    return {
      message: 'Detail kategori berhasil dimuat',
      data: category,
    };
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.slugify(dto.name);
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Kategori dengan nama/slug "${slug}" sudah ada`);
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() || null,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });

    return {
      message: 'Kategori baru berhasil dibuat',
      data: category,
    };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    let slug = category.slug;
    if (dto.name && dto.name.trim() !== category.name) {
      slug = this.slugify(dto.name);
      const duplicate = await this.prisma.category.findFirst({
        where: { slug, NOT: { id } },
      });
      if (duplicate) {
        throw new ConflictException(`Slug kategori "${slug}" sudah digunakan`);
      }
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name.trim(), slug }),
        ...(dto.description !== undefined && { description: dto.description?.trim() || null }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    return {
      message: 'Kategori berhasil diperbarui',
      data: updated,
    };
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    if (category._count.products > 0) {
      throw new ConflictException(
        `Kategori tidak dapat dihapus karena masih memuat ${category._count.products} produk. Nonaktifkan kategori sebagai alternatif.`,
      );
    }

    await this.prisma.category.delete({ where: { id } });

    return {
      message: 'Kategori berhasil dihapus',
      data: null,
    };
  }
}
