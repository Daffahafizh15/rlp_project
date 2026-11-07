import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateOrderDto, GetOrdersFilterDto, UpdateOrderStatusDto } from './dto/order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateOrderNumber;
    createOrder(userId: string, dto: CreateOrderDto): Promise<{
        message: string;
        data: {
            order: {
                items: {
                    id: string;
                    variantId: string | null;
                    quantity: number;
                    orderId: string;
                    productNameSnapshot: string;
                    variantSkuSnapshot: string;
                    sizeSnapshot: string;
                    colorSnapshot: string;
                    priceSnapshot: import("@prisma/client/runtime/library").Decimal;
                    subtotal: import("@prisma/client/runtime/library").Decimal;
                }[];
                shippingZone: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    rate: import("@prisma/client/runtime/library").Decimal;
                    isActive: boolean;
                };
                payment: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    orderId: string;
                    paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                    paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                    amount: import("@prisma/client/runtime/library").Decimal;
                    proofImageUrl: string | null;
                    proofUploadedAt: Date | null;
                    verifiedAt: Date | null;
                    verifiedBy: string | null;
                    rejectionReason: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                shippingZoneId: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                notes: string | null;
                trackingNumber: string | null;
                orderNumber: string;
                orderStatus: import(".prisma/client").$Enums.OrderStatus;
                shippingCost: import("@prisma/client/runtime/library").Decimal;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
                shippingAddressSnapshot: string;
            };
            paymentInstructions: {
                method: import(".prisma/client").$Enums.PaymentMethod;
                totalToPay: import("@prisma/client/runtime/library").Decimal;
                bankDetails: {
                    bankName: string;
                    accountNumber: string;
                    accountHolder: string;
                };
                qrisDetails: {
                    merchantName: string;
                    merchantNmid: string;
                    note: string;
                };
            };
        };
    }>;
    getMyOrders(userId: string): Promise<{
        message: string;
        data: ({
            items: {
                id: string;
                variantId: string | null;
                quantity: number;
                orderId: string;
                productNameSnapshot: string;
                variantSkuSnapshot: string;
                sizeSnapshot: string;
                colorSnapshot: string;
                priceSnapshot: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
            }[];
            shippingZone: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                rate: import("@prisma/client/runtime/library").Decimal;
                isActive: boolean;
            };
            payment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                orderId: string;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                amount: import("@prisma/client/runtime/library").Decimal;
                proofImageUrl: string | null;
                proofUploadedAt: Date | null;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                rejectionReason: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shippingZoneId: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            trackingNumber: string | null;
            orderNumber: string;
            orderStatus: import(".prisma/client").$Enums.OrderStatus;
            shippingCost: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            shippingAddressSnapshot: string;
        })[];
    }>;
    getOrderDetail(userId: string, userRole: string, orderId: string): Promise<{
        message: string;
        data: {
            shippingAddress: any;
            user: {
                id: string;
                fullName: string;
                email: string;
                phone: string;
            };
            items: ({
                variant: {
                    product: {
                        images: {
                            id: string;
                            imageUrl: string;
                            isPrimary: boolean;
                            sortOrder: number;
                            productId: string;
                        }[];
                    } & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        description: string;
                        isActive: boolean;
                        slug: string;
                        categoryId: string;
                        basePrice: import("@prisma/client/runtime/library").Decimal;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    isActive: boolean;
                    productId: string;
                    sku: string;
                    size: string;
                    color: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    stock: number;
                };
            } & {
                id: string;
                variantId: string | null;
                quantity: number;
                orderId: string;
                productNameSnapshot: string;
                variantSkuSnapshot: string;
                sizeSnapshot: string;
                colorSnapshot: string;
                priceSnapshot: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
            })[];
            shippingZone: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                rate: import("@prisma/client/runtime/library").Decimal;
                isActive: boolean;
            };
            payment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                orderId: string;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                amount: import("@prisma/client/runtime/library").Decimal;
                proofImageUrl: string | null;
                proofUploadedAt: Date | null;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                rejectionReason: string | null;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shippingZoneId: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            trackingNumber: string | null;
            orderNumber: string;
            orderStatus: import(".prisma/client").$Enums.OrderStatus;
            shippingCost: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            shippingAddressSnapshot: string;
        };
    }>;
    getAdminOrders(filter: GetOrdersFilterDto): Promise<{
        message: string;
        data: ({
            user: {
                id: string;
                fullName: string;
                email: string;
            };
            items: {
                id: string;
                variantId: string | null;
                quantity: number;
                orderId: string;
                productNameSnapshot: string;
                variantSkuSnapshot: string;
                sizeSnapshot: string;
                colorSnapshot: string;
                priceSnapshot: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
            }[];
            shippingZone: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                rate: import("@prisma/client/runtime/library").Decimal;
                isActive: boolean;
            };
            payment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                orderId: string;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                amount: import("@prisma/client/runtime/library").Decimal;
                proofImageUrl: string | null;
                proofUploadedAt: Date | null;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                rejectionReason: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shippingZoneId: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            trackingNumber: string | null;
            orderNumber: string;
            orderStatus: import(".prisma/client").$Enums.OrderStatus;
            shippingCost: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            shippingAddressSnapshot: string;
        })[];
    }>;
    updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<{
        message: string;
        data: {
            id: string;
            status: "CANCELLED";
        };
    } | {
        message: string;
        data: {
            items: {
                id: string;
                variantId: string | null;
                quantity: number;
                orderId: string;
                productNameSnapshot: string;
                variantSkuSnapshot: string;
                sizeSnapshot: string;
                colorSnapshot: string;
                priceSnapshot: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
            }[];
            payment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                orderId: string;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                amount: import("@prisma/client/runtime/library").Decimal;
                proofImageUrl: string | null;
                proofUploadedAt: Date | null;
                verifiedAt: Date | null;
                verifiedBy: string | null;
                rejectionReason: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shippingZoneId: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            trackingNumber: string | null;
            orderNumber: string;
            orderStatus: import(".prisma/client").$Enums.OrderStatus;
            shippingCost: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            shippingAddressSnapshot: string;
        };
    }>;
}
