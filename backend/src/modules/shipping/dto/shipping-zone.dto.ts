import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateShippingZoneDto {
  @ApiProperty({ example: 'Zona 1 - Jabodetabek', description: 'Nama zona pengiriman' })
  @IsString()
  @IsNotEmpty({ message: 'Nama zona pengiriman wajib diisi' })
  name: string;

  @ApiPropertyOptional({ example: 'Pengiriman area Jakarta, Bogor, Depok, Tangerang, Bekasi' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 15000, description: 'Tarif flat pengiriman dalam Rupiah' })
  @IsNumber()
  @Min(0, { message: 'Tarif tidak boleh bernilai negatif' })
  rate: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateShippingZoneDto {
  @ApiPropertyOptional({ example: 'Zona 1 - Jabodetabek Express' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Deskripsi wilayah...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 18000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
