import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductImageDto {
  @ApiProperty({ example: 'https://images.unsplash.com/...', description: 'URL atau path gambar produk' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class ProductVariantDto {
  @ApiProperty({ example: 'STR-OVR-BLK-L', description: 'SKU unik varian' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'L', description: 'Ukuran (S, M, L, XL, XXL)' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ example: 'Vintage Black', description: 'Warna varian' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 189000, description: 'Harga satuan varian' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 25, description: 'Stok awal varian' })
  @IsNumber()
  @Min(0)
  stock: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'cuid_category_id', description: 'ID kategori produk' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'Heavyweight Oversized T-Shirt', description: 'Nama produk' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Bahan combed cotton 280 GSM dengan fitting boxy oversized...', description: 'Deskripsi lengkap produk' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 189000, description: 'Harga acuan dasar produk' })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ type: [ProductImageDto], description: 'Daftar foto produk' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @ApiProperty({ type: [ProductVariantDto], description: 'Daftar varian (Ukuran, Warna, Stok, SKU)' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants: ProductVariantDto[];
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'cuid_category_id' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Heavyweight Oversized T-Shirt V2' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Deskripsi terbaru...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 199000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateStockDto {
  @ApiProperty({ example: 50, description: 'Jumlah stok baru' })
  @IsNumber()
  @Min(0)
  stock: number;
}

export class GetProductsFilterDto {
  @ApiPropertyOptional({ description: 'Pencarian nama atau deskripsi produk' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter slug atau ID kategori' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ['newest', 'price_asc', 'price_desc', 'name_asc'], default: 'newest' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 12, default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 12;
}
