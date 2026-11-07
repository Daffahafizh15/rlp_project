import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    const paidStatuses = [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.COMPLETED];

    const [
      totalOrders,
      waitingPaymentCount,
      paymentReviewCount,
      processingCount,
      shippedCount,
      completedCount,
      activeProductsCount,
      paidOrders,
      lowStockVariants,
      topSellingItems,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { orderStatus: OrderStatus.WAITING_PAYMENT } }),
      this.prisma.order.count({ where: { orderStatus: OrderStatus.PAYMENT_REVIEW } }),
      this.prisma.order.count({ where: { orderStatus: OrderStatus.PROCESSING } }),
      this.prisma.order.count({ where: { orderStatus: OrderStatus.SHIPPED } }),
      this.prisma.order.count({ where: { orderStatus: OrderStatus.COMPLETED } }),
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

    // Calculate total revenue and total sales count
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const totalSalesCount = paidOrders.length;

    // Daily revenue calculation for past 7 days chart
    const dailyMap = new Map<string, { date: string; revenue: number; orderCount: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      dailyMap.set(dateKey, { date: dateKey, revenue: 0, orderCount: 0 });
    }

    paidOrders.forEach((o) => {
      const key = o.createdAt.toISOString().slice(0, 10);
      if (dailyMap.has(key)) {
        const item = dailyMap.get(key)!;
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
}
