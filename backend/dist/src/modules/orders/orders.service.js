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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateOrderNumber() {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
        return `FRM-${dateStr}-${randomHex}`;
    }
    async createOrder(userId, dto) {
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
            throw new common_1.BadRequestException('Keranjang belanja Anda masih kosong. Silakan tambahkan produk terlebih dahulu.');
        }
        const address = await this.prisma.address.findFirst({
            where: { id: dto.addressId, userId },
            include: { shippingZone: true },
        });
        if (!address) {
            throw new common_1.NotFoundException('Alamat pengiriman tidak ditemukan atau bukan milik Anda');
        }
        if (!address.shippingZone.isActive) {
            throw new common_1.BadRequestException('Zona pengiriman untuk alamat ini sedang tidak aktif');
        }
        const createdOrder = await this.prisma.$transaction(async (tx) => {
            let subtotal = 0;
            const orderItemsData = [];
            for (const item of cart.items) {
                const liveVariant = await tx.productVariant.findUnique({
                    where: { id: item.variantId },
                    include: { product: true },
                });
                if (!liveVariant || !liveVariant.isActive || !liveVariant.product.isActive) {
                    throw new common_1.BadRequestException(`Produk untuk varian ${item.variant.sku} sudah tidak tersedia`);
                }
                if (liveVariant.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Stok untuk varian ${liveVariant.sku} tidak mencukupi (Tersisa: ${liveVariant.stock}, Diinginkan: ${item.quantity})`);
                }
                const price = Number(liveVariant.price);
                const itemSubtotal = price * item.quantity;
                subtotal += itemSubtotal;
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
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    shippingZoneId: address.shippingZoneId,
                    orderStatus: client_1.OrderStatus.WAITING_PAYMENT,
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
                            paymentStatus: client_1.PaymentStatus.PENDING,
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
                    bankDetails: dto.paymentMethod === 'BANK_TRANSFER'
                        ? {
                            bankName: 'BCA (Bank Central Asia)',
                            accountNumber: '8830-1928-00',
                            accountHolder: 'PT FORME APPAREL INDONESIA',
                        }
                        : null,
                    qrisDetails: dto.paymentMethod === 'QRIS'
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
    async getMyOrders(userId) {
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
    async getOrderDetail(userId, userRole, orderId) {
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
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (userRole !== client_1.Role.ADMIN && order.userId !== userId) {
            throw new common_1.ForbiddenException('Akses ditolak: Anda tidak memiliki akses ke pesanan ini');
        }
        let parsedAddress = null;
        try {
            parsedAddress = JSON.parse(order.shippingAddressSnapshot);
        }
        catch {
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
    async getAdminOrders(filter) {
        const where = {};
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
    async updateOrderStatus(orderId, dto) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, payment: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (order.orderStatus === client_1.OrderStatus.COMPLETED && dto.status !== client_1.OrderStatus.COMPLETED) {
            throw new common_1.BadRequestException('Pesanan yang telah selesai tidak dapat diubah statusnya');
        }
        if (dto.status === client_1.OrderStatus.CANCELLED && order.orderStatus !== client_1.OrderStatus.CANCELLED) {
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
                        orderStatus: client_1.OrderStatus.CANCELLED,
                    },
                });
            });
            return {
                message: 'Pesanan telah dibatalkan dan stok produk telah dikembalikan',
                data: { id: orderId, status: client_1.OrderStatus.CANCELLED },
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map