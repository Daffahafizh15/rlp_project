import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/payment.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    uploadProof(user: AuthenticatedUser, orderId: string, file: Express.Multer.File): Promise<{
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
}
export declare class AdminPaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
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
}
