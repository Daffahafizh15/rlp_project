import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemQuantityDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Shopping Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar item dalam keranjang belanja customer' })
  @ApiResponse({ status: 200, description: 'Keranjang belanja berhasil didapatkan' })
  async getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Menambahkan varian produk ke dalam keranjang' })
  @ApiResponse({ status: 200, description: 'Item berhasil ditambahkan ke keranjang' })
  @ApiResponse({ status: 400, description: 'Stok tidak mencukupi' })
  async addItem(@CurrentUser('id') userId: string, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(userId, dto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Memperbarui kuantitas item dalam keranjang' })
  @ApiResponse({ status: 200, description: 'Kuantitas berhasil diperbarui' })
  async updateQuantity(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
    @Body() dto: UpdateCartItemQuantityDto,
  ) {
    return this.cartService.updateItemQuantity(userId, itemId, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Menghapus satu item dari keranjang' })
  @ApiResponse({ status: 200, description: 'Item berhasil dihapus' })
  async removeItem(@CurrentUser('id') userId: string, @Param('id') itemId: string) {
    return this.cartService.removeItem(userId, itemId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Mengosongkan seluruh isi keranjang belanja' })
  @ApiResponse({ status: 200, description: 'Keranjang berhasil dikosongkan' })
  async clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
