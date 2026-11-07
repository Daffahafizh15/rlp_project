import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

const proofUploadDir = join(process.cwd(), 'uploads', 'proofs');
if (!existsSync(proofUploadDir)) {
  mkdirSync(proofUploadDir, { recursive: true });
}

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':orderId/proof')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: proofUploadDir,
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `proof-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 3 * 1024 * 1024, // 3MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Format file tidak didukung! Hanya JPG, JPEG, PNG, dan WEBP yang diizinkan.'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Unggah bukti transfer pembayaran pesanan (Customer)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Bukti pembayaran berhasil diunggah' })
  async uploadProof(
    @CurrentUser() user: AuthenticatedUser,
    @Param('orderId') orderId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File bukti pembayaran wajib diunggah');
    }

    const relativePath = `/uploads/proofs/${file.filename}`;
    return this.paymentsService.submitPaymentProof(user.id, user.role, orderId, relativePath);
  }
}

@ApiTags('Admin - Payment Verification')
@Controller('admin/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Mendapatkan seluruh pembayaran yang menunggu verifikasi (Khusus Admin)' })
  @ApiResponse({ status: 200, description: 'Daftar bukti pembayaran' })
  async getPendingVerifications() {
    return this.paymentsService.getPendingVerifications();
  }

  @Patch(':orderId/verify')
  @ApiOperation({ summary: 'Menyetujui (PAID) atau Menolak (REJECTED) bukti pembayaran (Khusus Admin)' })
  @ApiResponse({ status: 200, description: 'Status verifikasi berhasil diperbarui' })
  async verifyPayment(
    @CurrentUser('id') adminId: string,
    @Param('orderId') orderId: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentsService.verifyPayment(adminId, orderId, dto);
  }
}
