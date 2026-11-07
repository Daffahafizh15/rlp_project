import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, GetOrdersFilterDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat pesanan baru (Checkout keranjang customer)' })
  @ApiResponse({ status: 201, description: 'Pesanan berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Keranjang kosong atau stok tidak cukup' })
  async createOrder(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(userId, dto);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Mendapatkan seluruh riwayat pesanan milik customer yang login' })
  @ApiResponse({ status: 200, description: 'Daftar riwayat pesanan' })
  async getMyOrders(@CurrentUser('id') userId: string) {
    return this.ordersService.getMyOrders(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan detail faktur pesanan (Customer & Admin)' })
  @ApiResponse({ status: 200, description: 'Detail pesanan' })
  async getOrderDetail(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') orderId: string,
  ) {
    return this.ordersService.getOrderDetail(user.id, user.role, orderId);
  }
}

@ApiTags('Admin - Order Management')
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan seluruh pesanan di sistem toko FORME (Khusus Admin)' })
  @ApiResponse({ status: 200, description: 'Daftar seluruh pesanan' })
  async getAdminOrders(@Query() filter: GetOrdersFilterDto) {
    return this.ordersService.getAdminOrders(filter);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Memperbarui status pesanan (PROCESSING, SHIPPED, COMPLETED, CANCELLED)' })
  @ApiResponse({ status: 200, description: 'Status pesanan berhasil diubah' })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, dto);
  }
}
