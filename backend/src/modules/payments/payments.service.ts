import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { VerifyPaymentDto } from './dto/payment.dto';
import { OrderStatus, PaymentStatus, Role } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async submitPaymentProof(
    userId: string,
    userRole: string,
    orderId: string,
    proofFilePath: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('Akses ditolak: Anda tidak memiliki akses ke pesanan ini');
    }

    if (!order.payment) {
      throw new NotFoundException('Catatan pembayaran untuk pesanan ini tidak ditemukan');
    }

    if (order.orderStatus === OrderStatus.COMPLETED || order.orderStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Pesanan telah selesai atau dibatalkan, tidak dapat mengunggah bukti baru');
    }

    // Update payment & order state
    const updated = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: order.payment.id },
        data: {
          proofImageUrl: proofFilePath,
          proofUploadedAt: new Date(),
          paymentStatus: PaymentStatus.WAITING_VERIFICATION,
          rejectionReason: null, // Clear any prior rejection
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: OrderStatus.PAYMENT_REVIEW,
        },
      });

      return payment;
    });

    return {
      message: 'Bukti pembayaran berhasil diunggah. Tim FORME akan segera memverifikasi pesanan Anda.',
      data: updated,
    };
  }

  async verifyPayment(adminId: string, orderId: string, dto: VerifyPaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order || !order.payment) {
      throw new NotFoundException('Data pesanan atau pembayaran tidak ditemukan');
    }

    if (dto.status === PaymentStatus.REJECTED && !dto.rejectionReason) {
      throw new BadRequestException('Alasan penolakan wajib disertakan jika menolak pembayaran');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      let targetOrderStatus = order.orderStatus;

      if (dto.status === PaymentStatus.PAID) {
        targetOrderStatus = OrderStatus.PROCESSING;
      } else if (dto.status === PaymentStatus.REJECTED) {
        targetOrderStatus = OrderStatus.WAITING_PAYMENT;
      }

      const payment = await tx.payment.update({
        where: { id: order.payment.id },
        data: {
          paymentStatus: dto.status,
          verifiedAt: new Date(),
          verifiedBy: adminId,
          rejectionReason: dto.status === PaymentStatus.REJECTED ? dto.rejectionReason : null,
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: targetOrderStatus,
        },
      });

      return payment;
    });

    const actionText = dto.status === PaymentStatus.PAID ? 'disetujui' : 'ditolak';

    return {
      message: `Pembayaran pesanan ${order.orderNumber} berhasil ${actionText}`,
      data: updated,
    };
  }

  async getPendingVerifications() {
    const pendingPayments = await this.prisma.payment.findMany({
      where: {
        paymentStatus: PaymentStatus.WAITING_VERIFICATION,
      },
      orderBy: { proofUploadedAt: 'asc' },
      include: {
        order: {
          include: {
            user: { select: { id: true, fullName: true, email: true, phone: true } },
            items: true,
          },
        },
      },
    });

    return {
      message: 'Daftar pembayaran menunggu verifikasi',
      data: pendingPayments,
    };
  }
}
