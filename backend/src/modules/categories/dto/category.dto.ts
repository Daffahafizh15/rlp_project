import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Streetwear', description: 'Nama kategori produk' })
  @IsString()
  @IsNotEmpty({ message: 'Nama kategori wajib diisi' })
  name: string;

  @ApiPropertyOptional({ example: 'Koleksi busana urban streetwear', description: 'Deskripsi kategori' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true, default: true, description: 'Status aktif kategori' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Streetwear Modern', description: 'Nama kategori baru' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Koleksi busana urban terbaru', description: 'Deskripsi kategori' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true, description: 'Status aktif' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
