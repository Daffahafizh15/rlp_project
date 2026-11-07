import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderStatus, PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({ example: 'cuid_address_id', description: 'ID alamat pengiriman customer' })
  @IsString()
  @IsNotEmpty({ message: 'Alamat pengiriman wajib dipilih' })
  addressId: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.BANK_TRANSFER, description: 'Metode pembayaran (BANK_TRANSFER atau QRIS)' })
  @IsEnum(PaymentMethod, { message: 'Metode pembayaran harus BANK_TRANSFER atau QRIS' })
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'Tolong packing ekstra rapi', description: 'Catatan tambahan pesanan' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PROCESSING })
  @IsEnum(OrderStatus, { message: 'Status pesanan tidak valid' })
  status: OrderStatus;

  @ApiPropertyOptional({ example: 'JNE-REG-9876543210', description: 'Nomor resi kurir (wajib saat status SHIPPED)' })
  @IsOptional()
  @IsString()
  trackingNumber?: string;
}

export class GetOrdersFilterDto {
  @ApiPropertyOptional({ enum: OrderStatus, description: 'Filter status pesanan' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Pencarian nomor pesanan atau nama customer' })
  @IsOptional()
  @IsString()
  search?: string;
}
