import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  GetProductsFilterDto,
  UpdateProductDto,
  UpdateStockDto,
} from './dto/product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * 1. PUBLIC CATALOG (Akses Guest & Customer)
   * Guest dapat melihat seluruh katalog, melakukan pencarian, filter kategori, dan sorting.
   */
  @Get()
  @ApiOperation({
    summary: 'Katalog publik FORME (Dapat diakses oleh Guest tanpa login)',
    description:
      'Menampilkan daftar produk dengan ringkasan harga, thumbnail foto, varian ukuran/warna yang tersedia, serta filter pencarian dan kategori.',
  })
  @ApiResponse({ status: 200, description: 'Katalog produk berhasil didapatkan' })
  async findAll(@Query() filter: GetProductsFilterDto) {
    return this.productsService.findAll(filter);
  }

  /**
   * 2. PROTECTED PRODUCT DETAIL (Hanya Customer & Admin yang sudah Login)
   * Guest dilarang membuka detail produk; harus diarahkan ke login.
   */
  @Get(':identifier')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Detail produk lengkap (Wajib Login: Customer & Admin)',
    description:
      'Halaman detail produk hanya dapat diakses setelah login. Mengembalikan deskripsi lengkap, galeri multi-foto, varian warna/ukuran, dan ketersediaan stok.',
  })
  @ApiResponse({ status: 200, description: 'Detail produk berhasil didapatkan' })
  @ApiResponse({
    status: 401,
    description: 'Akses ditolak: Guest harus login terlebih dahulu untuk melihat detail produk.',
  })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  async findOne(@Param('identifier') identifier: string) {
    return this.productsService.findOne(identifier);
  }
}

@ApiTags('Admin - Product Management')
@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan data produk untuk form edit Admin (Khusus Admin)' })
  async findAdminProduct(@Param('id') id: string) {
    return this.productsService.findAdminProduct(id);
  }

  @Post()
  @ApiOperation({ summary: 'Menambahkan produk baru lengkap dengan varian dan foto (Khusus Admin)' })
  @ApiResponse({ status: 201, description: 'Produk berhasil dibuat' })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Memperbarui informasi produk (Khusus Admin)' })
  @ApiResponse({ status: 200, description: 'Produk berhasil diperbarui' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Patch('variants/:variantId/stock')
  @ApiOperation({ summary: 'Memperbarui stok varian secara langsung (Khusus Admin)' })
  @ApiResponse({ status: 200, description: 'Stok varian berhasil diubah' })
  async updateStock(
    @Param('variantId') variantId: string,
    @Body() dto: UpdateStockDto,
  ) {
    return this.productsService.updateVariantStock(variantId, dto.stock);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus atau menonaktifkan produk (Khusus Admin)' })
  @ApiResponse({ status: 200, description: 'Produk berhasil dihapus atau dinonaktifkan' })
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
