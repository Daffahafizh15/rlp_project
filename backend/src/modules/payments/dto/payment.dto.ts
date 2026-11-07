import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class VerifyPaymentDto {
  @ApiProperty({
    enum: [PaymentStatus.PAID, PaymentStatus.REJECTED],
    example: PaymentStatus.PAID,
    description: 'Status verifikasi (PAID untuk disetujui, REJECTED untuk ditolak)',
  })
  @IsEnum([PaymentStatus.PAID, PaymentStatus.REJECTED], {
    message: 'Status verifikasi harus PAID atau REJECTED',
  })
  status: PaymentStatus;

  @ApiPropertyOptional({
    example: 'Bukti transfer buram atau nominal tidak sesuai',
    description: 'Alasan penolakan (Wajib jika status REJECTED)',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
