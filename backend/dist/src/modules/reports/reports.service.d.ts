import { PrismaService } from '../../core/prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardMetrics(): Promise<{
        message: string;
        data: {
            summary: {
                totalRevenue: number;
                totalSalesCount: number;
                totalOrders: number;
                activeProductsCount: number;
                ordersByStatus: {
                    waitingPayment: number;
                    paymentReview: number;
                    processing: number;
                    shipped: number;
                    completed: number;
                };
            };
            salesChart: {
                date: string;
                revenue: number;
                orderCount: number;
            }[];
            lowStockAlerts: {
                variantId: string;
                sku: string;
                productName: string;
                size: string;
                color: string;
                currentStock: number;
            }[];
            topSellingProducts: {
                productName: string;
                totalSold: number;
                totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
            }[];
        };
    }>;
}
