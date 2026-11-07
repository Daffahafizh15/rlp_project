import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Rumah', description: 'Label alamat (Rumah, Kantor, dsb.)' })
  @IsString()
  @IsNotEmpty({ message: 'Label alamat wajib diisi' })
  label: string;

  @ApiProperty({ example: 'Ahmad Pratama', description: 'Nama penerima paket' })
  @IsString()
  @IsNotEmpty({ message: 'Nama penerima wajib diisi' })
  recipientName: string;

  @ApiProperty({ example: '081234567890', description: 'Nomor HP penerima' })
  @IsString()
  @IsNotEmpty({ message: 'Nomor telepon penerima wajib diisi' })
  phoneNumber: string;

  @ApiProperty({ example: 'Jl. Senopati Raya No. 45, Kebayoran Baru', description: 'Alamat lengkap jalan/nomor' })
  @IsString()
  @IsNotEmpty({ message: 'Alamat lengkap wajib diisi' })
  fullAddress: string;

  @ApiProperty({ example: 'Jakarta Selatan', description: 'Kota atau Kabupaten' })
  @IsString()
  @IsNotEmpty({ message: 'Kota wajib diisi' })
  city: string;

  @ApiProperty({ example: 'DKI Jakarta', description: 'Provinsi' })
  @IsString()
  @IsNotEmpty({ message: 'Provinsi wajib diisi' })
  province: string;

  @ApiProperty({ example: '12190', description: 'Kode Pos' })
  @IsString()
  @IsNotEmpty({ message: 'Kode pos wajib diisi' })
  postalCode: string;

  @ApiProperty({ example: 'cuid_shipping_zone_id', description: 'ID zona pengiriman yang mencakup alamat ini' })
  @IsString()
  @IsNotEmpty({ message: 'Zona pengiriman wajib dipilih' })
  shippingZoneId: string;

  @ApiPropertyOptional({ example: true, default: false, description: 'Jadikan alamat utama/default' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @ApiPropertyOptional({ example: 'Kantor' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ example: 'Ahmad Pratama' })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiPropertyOptional({ example: '081299998888' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Gedung Menara Sudirman Lt. 12' })
  @IsOptional()
  @IsString()
  fullAddress?: string;

  @ApiPropertyOptional({ example: 'Jakarta Pusat' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'DKI Jakarta' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: '10220' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'cuid_shipping_zone_id' })
  @IsOptional()
  @IsString()
  shippingZoneId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
