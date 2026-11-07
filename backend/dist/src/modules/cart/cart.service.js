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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
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
    async getCart(userId) {
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
            const primaryImage = item.variant.product.images[0]?.imageUrl || null;
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
    async addItem(userId, dto) {
        const cart = await this.getOrCreateCart(userId);
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: dto.variantId },
            include: { product: true },
        });
        if (!variant || !variant.isActive || !variant.product.isActive) {
            throw new common_1.NotFoundException('Varian produk tidak ditemukan atau tidak tersedia');
        }
        if (variant.stock <= 0) {
            throw new common_1.BadRequestException(`Maaf, stok untuk varian ${variant.sku} sedang habis`);
        }
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
            throw new common_1.BadRequestException(`Kuantitas melebihi stok yang tersedia (Maksimal: ${variant.stock}, Di keranjang: ${existingItem?.quantity || 0})`);
        }
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
        }
        else {
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
    async updateItemQuantity(userId, itemId, dto) {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id },
            include: { variant: true },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item keranjang tidak ditemukan');
        }
        if (dto.quantity > item.variant.stock) {
            throw new common_1.BadRequestException(`Kuantitas melebihi stok yang tersedia (Maksimal: ${item.variant.stock})`);
        }
        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: dto.quantity },
        });
        return this.getCart(userId);
    }
    async removeItem(userId, itemId) {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item keranjang tidak ditemukan');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        return this.getCart(userId);
    }
    async clearCart(userId) {
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
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map