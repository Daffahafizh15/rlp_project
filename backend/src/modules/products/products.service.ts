import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  CreateProductDto,
  GetProductsFilterDto,
  UpdateProductDto,
} from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async findAll(filter: GetProductsFilterDto) {
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(filter.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (filter.search && filter.search.trim()) {
      const q = filter.search.trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
      ];
    }

    if (filter.category && filter.category.trim()) {
      where.category = {
        OR: [
          { slug: filter.category.trim() },
          { id: filter.category.trim() },
        ],
      };
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' };
    if (filter.sort === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (filter.sort === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    } else if (filter.sort === 'name_asc') {
      orderBy = { name: 'asc' };
    }

    const [totalItems, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              size: true,
              color: true,
              price: true,
              stock: true,
            },
          },
        },
      }),
    ]);

    // Format for catalog card summary
    const formattedProducts = products.map((p) => {
      const primaryImage = p.images.find((img) => img.isPrimary)?.imageUrl || p.images[0]?.imageUrl || null;
      const uniqueSizes = Array.from(new Set(p.variants.map((v) => v.size)));
      const uniqueColors = Array.from(new Set(p.variants.map((v) => v.color)));
      const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        category: p.category,
        primaryImage,
        availableSizes: uniqueSizes,
        availableColors: uniqueColors,
        totalStock,
        inStock: totalStock > 0,
        createdAt: p.createdAt,
      };
    });

    return {
      message: 'Katalog produk berhasil dimuat',
      data: {
        items: formattedProducts,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
          limit,
        },
      },
    };
  }

  async findOne(identifier: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
        isActive: true,
      },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
        variants: {
          where: { isActive: true },
          orderBy: [{ color: 'asc' }, { size: 'asc' }],
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan atau sudah tidak aktif');
    }

    return {
      message: 'Detail produk berhasil dimuat',
      data: product,
    };
  }

  async findAdminProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sku: 'asc' } },
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    return {
      message: 'Data produk admin berhasil dimuat',
      data: product,
    };
  }

  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Kategori yang dipilih tidak valid');
    }

    let slug = this.slugify(dto.name);
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Verify unique SKUs in variants
    const skus = dto.variants.map((v) => v.sku.trim());
    if (new Set(skus).size !== skus.length) {
      throw new BadRequestException('Terdapat duplikasi SKU pada varian yang dimasukkan');
    }

    const existingSkus = await this.prisma.productVariant.findMany({
      where: { sku: { in: skus } },
    });
    if (existingSkus.length > 0) {
      throw new ConflictException(
        `SKU [${existingSkus.map((v) => v.sku).join(', ')}] sudah terdaftar di sistem`,
      );
    }

    const newProduct = await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          categoryId: dto.categoryId,
          name: dto.name.trim(),
          slug,
          description: dto.description.trim(),
          basePrice: dto.basePrice,
          isActive: true,
        },
      });

      if (dto.images && dto.images.length > 0) {
        await tx.productImage.createMany({
          data: dto.images.map((img, idx) => ({
            productId: product.id,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
            sortOrder: img.sortOrder !== undefined ? img.sortOrder : idx,
          })),
        });
      }

      await tx.productVariant.createMany({
        data: dto.variants.map((v) => ({
          productId: product.id,
          sku: v.sku.trim(),
          size: v.size.trim().toUpperCase(),
          color: v.color.trim(),
          price: v.price !== undefined ? v.price : dto.basePrice,
          stock: v.stock,
          isActive: true,
        })),
      });

      return product;
    });

    return this.findOne(newProduct.id);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    let slug = product.slug;
    if (dto.name && dto.name.trim() !== product.name) {
      slug = this.slugify(dto.name);
      const duplicate = await this.prisma.product.findFirst({
        where: { slug, NOT: { id } },
      });
      if (duplicate) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(dto.name && { name: dto.name.trim(), slug }),
        ...(dto.description && { description: dto.description.trim() }),
        ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    return {
      message: 'Produk berhasil diperbarui',
      data: updated,
    };
  }

  async updateVariantStock(variantId: string, newStock: number) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) {
      throw new NotFoundException('Varian produk tidak ditemukan');
    }

    const updated = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: Math.max(0, newStock) },
    });

    return {
      message: `Stok varian ${variant.sku} berhasil diubah menjadi ${updated.stock}`,
      data: updated,
    };
  }

  async delete(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            orderItems: { take: 1 },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    const hasOrders = product.variants.some((v) => v.orderItems.length > 0);

    if (hasOrders) {
      // Soft delete to maintain order history
      await this.prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      return {
        message: 'Produk dinonaktifkan karena telah memiliki riwayat pesanan',
        data: { deactivated: true },
      };
    }

    await this.prisma.product.delete({ where: { id } });

    return {
      message: 'Produk berhasil dihapus permanen',
      data: { deleted: true },
    };
  }
}
