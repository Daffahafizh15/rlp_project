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
import { ShippingService } from './shipping.service';
import { CreateShippingZoneDto, UpdateShippingZoneDto } from './dto/shipping-zone.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Shipping Zones')
@Controller('shipping/zones')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar zona pengiriman aktif (Publik/Checkout)' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Daftar zona pengiriman berhasil didapatkan' })
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const shouldInclude = includeInactive === 'true';
    return this.shippingService.findAll(shouldInclude);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan detail zona pengiriman berdasarkan ID' })
  async findOne(@Param('id') id: string) {
    return this.shippingService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Menambahkan zona pengiriman baru (Khusus Admin)' })
  @ApiResponse({ status: 201, description: 'Zona berhasil ditambahkan' })
  async create(@Body() dto: CreateShippingZoneDto) {
    return this.shippingService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Memperbarui tarif atau informasi zona pengiriman (Khusus Admin)' })
  @ApiResponse({ status: 200, description: 'Zona berhasil diperbarui' })
  async update(@Param('id') id: string, @Body() dto: UpdateShippingZoneDto) {
    return this.shippingService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Menghapus zona pengiriman (Khusus Admin)' })
  @ApiResponse({ status: 200, description: 'Zona berhasil dihapus' })
  async delete(@Param('id') id: string) {
    return this.shippingService.delete(id);
  }
}
