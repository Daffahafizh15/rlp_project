import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemQuantityDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const fullCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                    images: { where: { isPrimary: true }, take: 1 },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const items = (fullCart?.items || []).map((item) => {
      const price = Number(item.variant.price);
      const subtotal = price * item.quantity;
      const primaryImage =
        item.variant.product.images[0]?.imageUrl || null;

      return {
        id: item.id,
        variantId: item.variantId,
        productId: item.variant.productId,
        productName: item.variant.product.name,
        productSlug: item.variant.product.slug,
        category: item.variant.product.category.name,
        sku: item.variant.sku,
        size: item.variant.size,
        color: item.variant.color,
        price,
        stock: item.variant.stock,
        quantity: item.quantity,
        subtotal,
        primaryImage,
        isOutOfStock: item.variant.stock <= 0,
        isQuantityExceeded: item.quantity > item.variant.stock,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      message: 'Keranjang belanja berhasil dimuat',
      data: {
        cartId: cart.id,
        items,
        totalItems,
        subtotal,
      },
    };
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCart(userId);

    // Validate variant and stock
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.variantId },
      include: { product: true },
    });

    if (!variant || !variant.isActive || !variant.product.isActive) {
      throw new NotFoundException('Varian produk tidak ditemukan atau tidak tersedia');
    }

    if (variant.stock <= 0) {
      throw new BadRequestException(`Maaf, stok untuk varian ${variant.sku} sedang habis`);
    }

    // Check if variant already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: dto.variantId,
        },
      },
    });

    const newQuantity = (existingItem?.quantity || 0) + dto.quantity;

    if (newQuantity > variant.stock) {
      throw new BadRequestException(
        `Kuantitas melebihi stok yang tersedia (Maksimal: ${variant.stock}, Di keranjang: ${existingItem?.quantity || 0})`,
      );
    }

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: dto.variantId,
          quantity: dto.quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(userId: string, itemId: string, dto: UpdateCartItemQuantityDto) {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { variant: true },
    });

    if (!item) {
      throw new NotFoundException('Item keranjang tidak ditemukan');
    }

    if (dto.quantity > item.variant.stock) {
      throw new BadRequestException(
        `Kuantitas melebihi stok yang tersedia (Maksimal: ${item.variant.stock})`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new NotFoundException('Item keranjang tidak ditemukan');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return {
      message: 'Keranjang belanja berhasil dikosongkan',
      data: {
        cartId: cart.id,
        items: [],
        totalItems: 0,
        subtotal: 0,
      },
    };
  }
}
