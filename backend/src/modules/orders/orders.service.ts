import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateOrderDto, GetOrdersFilterDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderStatus, PaymentStatus, Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    return `FRM-${dateStr}-${randomHex}`;
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    // 1. Fetch user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Keranjang belanja Anda masih kosong. Silakan tambahkan produk terlebih dahulu.');
    }

    // 2. Fetch shipping address and zone
    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId },
      include: { shippingZone: true },
    });

    if (!address) {
      throw new NotFoundException('Alamat pengiriman tidak ditemukan atau bukan milik Anda');
    }

    if (!address.shippingZone.isActive) {
      throw new BadRequestException('Zona pengiriman untuk alamat ini sedang tidak aktif');
    }

    // 3. Execute Database Transaction for Order & Stock Deduction
    const createdOrder = await this.prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const item of cart.items) {
        // Re-check live stock inside transaction
        const liveVariant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!liveVariant || !liveVariant.isActive || !liveVariant.product.isActive) {
          throw new BadRequestException(`Produk untuk varian ${item.variant.sku} sudah tidak tersedia`);
        }

        if (liveVariant.stock < item.quantity) {
          throw new BadRequestException(
            `Stok untuk varian ${liveVariant.sku} tidak mencukupi (Tersisa: ${liveVariant.stock}, Diinginkan: ${item.quantity})`,
          );
        }

        const price = Number(liveVariant.price);
        const itemSubtotal = price * item.quantity;
        subtotal += itemSubtotal;

        // Prepare snapshot item
        orderItemsData.push({
          variantId: liveVariant.id,
          productNameSnapshot: liveVariant.product.name,
          variantSkuSnapshot: liveVariant.sku,
          sizeSnapshot: liveVariant.size,
          colorSnapshot: liveVariant.color,
          priceSnapshot: price,
          quantity: item.quantity,
          subtotal: itemSubtotal,
        });

        // Deduct variant stock immediately (reservation)
        await tx.productVariant.update({
          where: { id: liveVariant.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const shippingCost = Number(address.shippingZone.rate);
      const totalAmount = subtotal + shippingCost;
      const orderNumber = this.generateOrderNumber();

      const addressSnapshot = JSON.stringify({
        recipientName: address.recipientName,
        phoneNumber: address.phoneNumber,
        fullAddress: address.fullAddress,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        zoneName: address.shippingZone.name,
      });

      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          shippingZoneId: address.shippingZoneId,
          orderStatus: OrderStatus.WAITING_PAYMENT,
          subtotal,
          shippingCost,
          totalAmount,
          shippingAddressSnapshot: addressSnapshot,
          notes: dto.notes?.trim() || null,
          items: {
            create: orderItemsData,
          },
          payment: {
            create: {
              paymentMethod: dto.paymentMethod,
              paymentStatus: PaymentStatus.PENDING,
              amount: totalAmount,
            },
          },
        },
        include: {
          items: true,
          payment: true,
          shippingZone: true,
        },
      });

      // Clear user's cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });

    return {
      message: 'Pesanan berhasil dibuat! Silakan selesaikan pembayaran.',
      data: {
        order: createdOrder,
        paymentInstructions: {
          method: dto.paymentMethod,
          totalToPay: createdOrder.totalAmount,
          bankDetails:
            dto.paymentMethod === 'BANK_TRANSFER'
              ? {
                  bankName: 'BCA (Bank Central Asia)',
                  accountNumber: '8830-1928-00',
                  accountHolder: 'PT FORME APPAREL INDONESIA',
                }
              : null,
          qrisDetails:
            dto.paymentMethod === 'QRIS'
              ? {
                  merchantName: 'FORME FASHION OFFICIAL',
                  merchantNmid: 'ID1020039281729',
                  note: 'Scan QRIS menggunakan aplikasi perbankan atau e-wallet apa saja (GoPay, OVO, Dana, ShopeePay, BCA Mobile)',
                }
              : null,
        },
      },
    };
  }

  async getMyOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        payment: true,
        shippingZone: true,
      },
    });

    return {
      message: 'Riwayat pesanan berhasil dimuat',
      data: orders,
    };
  }

  async getOrderDetail(userId: string, userRole: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true }, take: 1 },
                  },
                },
              },
            },
          },
        },
        payment: true,
        shippingZone: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    // Role ownership check
    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('Akses ditolak: Anda tidak memiliki akses ke pesanan ini');
    }

    let parsedAddress = null;
    try {
      parsedAddress = JSON.parse(order.shippingAddressSnapshot);
    } catch {
      parsedAddress = order.shippingAddressSnapshot;
    }

    return {
      message: 'Detail pesanan berhasil dimuat',
      data: {
        ...order,
        shippingAddress: parsedAddress,
      },
    };
  }

  async getAdminOrders(filter: GetOrdersFilterDto) {
    const where: any = {};

    if (filter.status) {
      where.orderStatus = filter.status;
    }

    if (filter.search && filter.search.trim()) {
      const q = filter.search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { user: { fullName: { contains: q } } },
        { user: { email: { contains: q } } },
      ];
    }

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        payment: true,
        items: true,
        shippingZone: true,
      },
    });

    return {
      message: 'Daftar pesanan admin berhasil dimuat',
      data: orders,
    };
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payment: true },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    // If order is already completed or cancelled, prevent re-modifying
    if (order.orderStatus === OrderStatus.COMPLETED && dto.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('Pesanan yang telah selesai tidak dapat diubah statusnya');
    }

    // If changing to CANCELLED and was not already cancelled: ROLLBACK STOCKS!
    if (dto.status === OrderStatus.CANCELLED && order.orderStatus !== OrderStatus.CANCELLED) {
      await this.prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }
        }

        await tx.order.update({
          where: { id: orderId },
          data: {
            orderStatus: OrderStatus.CANCELLED,
          },
        });
      });

      return {
        message: 'Pesanan telah dibatalkan dan stok produk telah dikembalikan',
        data: { id: orderId, status: OrderStatus.CANCELLED },
      };
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: dto.status,
        ...(dto.trackingNumber && { trackingNumber: dto.trackingNumber.trim() }),
      },
      include: { items: true, payment: true },
    });

    return {
      message: `Status pesanan ${order.orderNumber} berhasil diperbarui menjadi ${dto.status}`,
      data: updated,
    };
  }
}
