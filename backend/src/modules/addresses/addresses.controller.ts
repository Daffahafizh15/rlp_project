import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Customer Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar alamat pengguna yang sedang login' })
  @ApiResponse({ status: 200, description: 'Daftar alamat berhasil didapatkan' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.addressesService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan detail alamat' })
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.addressesService.findOne(userId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Menambahkan alamat pengiriman baru' })
  @ApiResponse({ status: 201, description: 'Alamat berhasil ditambahkan' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Memperbarui data alamat' })
  @ApiResponse({ status: 200, description: 'Alamat berhasil diperbarui' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(userId, id, dto);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Menjadikan alamat ini sebagai alamat default utama' })
  @ApiResponse({ status: 200, description: 'Alamat default berhasil diset' })
  async setDefault(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.addressesService.setDefault(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus alamat' })
  @ApiResponse({ status: 200, description: 'Alamat berhasil dihapus' })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.addressesService.delete(userId, id);
  }
}
