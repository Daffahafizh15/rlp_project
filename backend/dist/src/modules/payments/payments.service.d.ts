import { PrismaService } from '../../core/prisma/prisma.service';
import { VerifyPaymentDto } from './dto/payment.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    submitPaymentProof(userId: string, userRole: string, orderId: string, proofFilePath: string): Promise<{
        message: string;
        data: {
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
    }>;
    verifyPayment(adminId: string, orderId: string, dto: VerifyPaymentDto): Promise<{
        message: string;
        data: {
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
    }>;
    getPendingVerifications(): Promise<{
        message: string;
        data: ({
            order: {
                user: {
                    id: string;
                    fullName: string;
                    email: string;
                    phone: string;
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
        } & {
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
        })[];
    }>;
}
