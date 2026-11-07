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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitPaymentProof(userId, userRole, orderId, proofFilePath) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (userRole !== client_1.Role.ADMIN && order.userId !== userId) {
            throw new common_1.ForbiddenException('Akses ditolak: Anda tidak memiliki akses ke pesanan ini');
        }
        if (!order.payment) {
            throw new common_1.NotFoundException('Catatan pembayaran untuk pesanan ini tidak ditemukan');
        }
        if (order.orderStatus === client_1.OrderStatus.COMPLETED || order.orderStatus === client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Pesanan telah selesai atau dibatalkan, tidak dapat mengunggah bukti baru');
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.update({
                where: { id: order.payment.id },
                data: {
                    proofImageUrl: proofFilePath,
                    proofUploadedAt: new Date(),
                    paymentStatus: client_1.PaymentStatus.WAITING_VERIFICATION,
                    rejectionReason: null,
                },
            });
            await tx.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: client_1.OrderStatus.PAYMENT_REVIEW,
                },
            });
            return payment;
        });
        return {
            message: 'Bukti pembayaran berhasil diunggah. Tim FORME akan segera memverifikasi pesanan Anda.',
            data: updated,
        };
    }
    async verifyPayment(adminId, orderId, dto) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });
        if (!order || !order.payment) {
            throw new common_1.NotFoundException('Data pesanan atau pembayaran tidak ditemukan');
        }
        if (dto.status === client_1.PaymentStatus.REJECTED && !dto.rejectionReason) {
            throw new common_1.BadRequestException('Alasan penolakan wajib disertakan jika menolak pembayaran');
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            let targetOrderStatus = order.orderStatus;
            if (dto.status === client_1.PaymentStatus.PAID) {
                targetOrderStatus = client_1.OrderStatus.PROCESSING;
            }
            else if (dto.status === client_1.PaymentStatus.REJECTED) {
                targetOrderStatus = client_1.OrderStatus.WAITING_PAYMENT;
            }
            const payment = await tx.payment.update({
                where: { id: order.payment.id },
                data: {
                    paymentStatus: dto.status,
                    verifiedAt: new Date(),
                    verifiedBy: adminId,
                    rejectionReason: dto.status === client_1.PaymentStatus.REJECTED ? dto.rejectionReason : null,
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
        const actionText = dto.status === client_1.PaymentStatus.PAID ? 'disetujui' : 'ditolak';
        return {
            message: `Pembayaran pesanan ${order.orderNumber} berhasil ${actionText}`,
            data: updated,
        };
    }
    async getPendingVerifications() {
        const pendingPayments = await this.prisma.payment.findMany({
            where: {
                paymentStatus: client_1.PaymentStatus.WAITING_VERIFICATION,
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map