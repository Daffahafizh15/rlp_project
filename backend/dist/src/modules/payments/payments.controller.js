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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPaymentsController = exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const payments_service_1 = require("./payments.service");
const payment_dto_1 = require("./dto/payment.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const proofUploadDir = (0, path_1.join)(process.cwd(), 'uploads', 'proofs');
if (!(0, fs_1.existsSync)(proofUploadDir)) {
    (0, fs_1.mkdirSync)(proofUploadDir, { recursive: true });
}
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async uploadProof(user, orderId, file) {
        if (!file) {
            throw new common_1.BadRequestException('File bukti pembayaran wajib diunggah');
        }
        const relativePath = `/uploads/proofs/${file.filename}`;
        return this.paymentsService.submitPaymentProof(user.id, user.role, orderId, relativePath);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(':orderId/proof'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: proofUploadDir,
            filename: (req, file, cb) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `proof-${uniqueSuffix}${ext}`);
            },
        }),
        limits: {
            fileSize: 3 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new common_1.BadRequestException('Format file tidak didukung! Hanya JPG, JPEG, PNG, dan WEBP yang diizinkan.'), false);
            }
            cb(null, true);
        },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Unggah bukti transfer pembayaran pesanan (Customer)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bukti pembayaran berhasil diunggah' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "uploadProof", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
let AdminPaymentsController = class AdminPaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async getPendingVerifications() {
        return this.paymentsService.getPendingVerifications();
    }
    async verifyPayment(adminId, orderId, dto) {
        return this.paymentsService.verifyPayment(adminId, orderId, dto);
    }
};
exports.AdminPaymentsController = AdminPaymentsController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan seluruh pembayaran yang menunggu verifikasi (Khusus Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar bukti pembayaran' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "getPendingVerifications", null);
__decorate([
    (0, common_1.Patch)(':orderId/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Menyetujui (PAID) atau Menolak (REJECTED) bukti pembayaran (Khusus Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status verifikasi berhasil diperbarui' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, payment_dto_1.VerifyPaymentDto]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "verifyPayment", null);
exports.AdminPaymentsController = AdminPaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Payment Verification'),
    (0, common_1.Controller)('admin/payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], AdminPaymentsController);
//# sourceMappingURL=payments.controller.js.map