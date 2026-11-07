import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemQuantityDto } from './dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
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
    updateQuantity(userId: string, itemId: string, dto: UpdateCartItemQuantityDto): Promise<{
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
