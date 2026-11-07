import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ example: 'cuid_variant_id', description: 'ID varian produk yang dipilih' })
  @IsString()
  @IsNotEmpty({ message: 'Varian produk wajib dipilih' })
  variantId: string;

  @ApiProperty({ example: 1, default: 1, description: 'Jumlah item yang ingin ditambahkan' })
  @IsInt()
  @Min(1, { message: 'Jumlah minimal adalah 1' })
  quantity: number;
}

export class UpdateCartItemQuantityDto {
  @ApiProperty({ example: 2, description: 'Jumlah kuantitas baru' })
  @IsInt()
  @Min(1, { message: 'Jumlah minimal adalah 1' })
  quantity: number;
}
