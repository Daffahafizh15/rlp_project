import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar seluruh kategori (Publik/Guest)' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Daftar kategori berhasil didapatkan' })
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const shouldInclude = includeInactive === 'true';
    return this.categoriesService.findAll(shouldInclude);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan detail kategori berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Detail kategori berhasil didapatkan' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Menambahkan kategori baru (Khusus Admin)' })
  @ApiResponse({ status: 201, description: 'Kategori berhasil dibuat' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mengubah kategori (Khusus Admin)' })
  @ApiResponse({ status: 200, description: 'Kategori berhasil diperbarui' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Menghapus kategori (Khusus Admin)' })
  @ApiResponse({ status: 200, description: 'Kategori berhasil dihapus' })
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
