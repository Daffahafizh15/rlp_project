import { PrismaService } from '../../core/prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemQuantityDto } from './dto/cart.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    private getOrCreateCart;
    getCart(userId: string): Promise<{
        message: string;
        data: {
            cartId: string;
            items: {
                id: string;
                variantId: string;
                productId: string;
                productName: string;
                productSlug: string;
                category: string;
                sku: string;
                size: string;
                color: string;
                price: number;
                stock: number;
                quantity: number;
                subtotal: number;
                primaryImage: string;
                isOutOfStock: boolean;
                isQuantityExceeded: boolean;
            }[];
            totalItems: number;
            subtotal: number;
        };
    }>;
    addItem(userId: string, dto: AddCartItemDto): Promise<{
        message: string;
        data: {
            cartId: string;
            items: {
                id: string;
                variantId: string;
                productId: string;
                productName: string;
                productSlug: string;
                category: string;
                sku: string;
                size: string;
                color: string;
                price: number;
                stock: number;
                quantity: number;
                subtotal: number;
                primaryImage: string;
                isOutOfStock: boolean;
                isQuantityExceeded: boolean;
            }[];
            totalItems: number;
            subtotal: number;
        };
    }>;
    updateItemQuantity(userId: string, itemId: string, dto: UpdateCartItemQuantityDto): Promise<{
        message: string;
        data: {
            cartId: string;
            items: {
                id: string;
                variantId: string;
                productId: string;
                productName: string;
                productSlug: string;
                category: string;
                sku: string;
                size: string;
                color: string;
                price: number;
                stock: number;
                quantity: number;
                subtotal: number;
                primaryImage: string;
                isOutOfStock: boolean;
                isQuantityExceeded: boolean;
            }[];
            totalItems: number;
            subtotal: number;
        };
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        message: string;
        data: {
            cartId: string;
            items: {
                id: string;
                variantId: string;
                productId: string;
                productName: string;
                productSlug: string;
                category: string;
                sku: string;
                size: string;
                color: string;
                price: number;
                stock: number;
                quantity: number;
                subtotal: number;
                primaryImage: string;
                isOutOfStock: boolean;
                isQuantityExceeded: boolean;
            }[];
            totalItems: number;
            subtotal: number;
        };
    }>;
    clearCart(userId: string): Promise<{
        message: string;
        data: {
            cartId: string;
            items: any[];
            totalItems: number;
            subtotal: number;
        };
    }>;
}
