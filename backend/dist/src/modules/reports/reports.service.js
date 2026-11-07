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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardMetrics() {
        const paidStatuses = [client_1.OrderStatus.PROCESSING, client_1.OrderStatus.SHIPPED, client_1.OrderStatus.COMPLETED];
        const [totalOrders, waitingPaymentCount, paymentReviewCount, processingCount, shippedCount, completedCount, activeProductsCount, paidOrders, lowStockVariants, topSellingItems,] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { orderStatus: client_1.OrderStatus.WAITING_PAYMENT } }),
            this.prisma.order.count({ where: { orderStatus: client_1.OrderStatus.PAYMENT_REVIEW } }),
            this.prisma.order.count({ where: { orderStatus: client_1.OrderStatus.PROCESSING } }),
            this.prisma.order.count({ where: { orderStatus: client_1.OrderStatus.SHIPPED } }),
            this.prisma.order.count({ where: { orderStatus: client_1.OrderStatus.COMPLETED } }),
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.order.findMany({
                where: { orderStatus: { in: paidStatuses } },
                select: { totalAmount: true, subtotal: true, createdAt: true },
            }),
            this.prisma.productVariant.findMany({
                where: { stock: { lte: 5 }, isActive: true },
                include: {
                    product: { select: { id: true, name: true, slug: true } },
                },
                orderBy: { stock: 'asc' },
                take: 10,
            }),
            this.prisma.orderItem.groupBy({
                by: ['productNameSnapshot'],
                _sum: {
                    quantity: true,
                    subtotal: true,
                },
                orderBy: {
                    _sum: {
                        quantity: 'desc',
                    },
                },
                take: 5,
            }),
        ]);
        const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const totalSalesCount = paidOrders.length;
        const dailyMap = new Map();
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().slice(0, 10);
            dailyMap.set(dateKey, { date: dateKey, revenue: 0, orderCount: 0 });
        }
        paidOrders.forEach((o) => {
            const key = o.createdAt.toISOString().slice(0, 10);
            if (dailyMap.has(key)) {
                const item = dailyMap.get(key);
                item.revenue += Number(o.totalAmount);
                item.orderCount += 1;
            }
        });
        const salesChart = Array.from(dailyMap.values());
        return {
            message: 'Metrik dashboard admin berhasil dimuat',
            data: {
                summary: {
                    totalRevenue,
                    totalSalesCount,
                    totalOrders,
                    activeProductsCount,
                    ordersByStatus: {
                        waitingPayment: waitingPaymentCount,
                        paymentReview: paymentReviewCount,
                        processing: processingCount,
                        shipped: shippedCount,
                        completed: completedCount,
                    },
                },
                salesChart,
                lowStockAlerts: lowStockVariants.map((v) => ({
                    variantId: v.id,
                    sku: v.sku,
                    productName: v.product.name,
                    size: v.size,
                    color: v.color,
                    currentStock: v.stock,
                })),
                topSellingProducts: topSellingItems.map((item) => ({
                    productName: item.productNameSnapshot,
                    totalSold: item._sum.quantity || 0,
                    totalRevenue: item._sum.subtotal || 0,
                })),
            },
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map