"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrdersController = exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const order_dto_1 = require("./dto/order.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async createOrder(userId, dto) {
        return this.ordersService.createOrder(userId, dto);
    }
    async getMyOrders(userId) {
        return this.ordersService.getMyOrders(userId);
    }
    async getOrderDetail(user, orderId) {
        return this.ordersService.getOrderDetail(user.id, user.role, orderId);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Membuat pesanan baru (Checkout keranjang customer)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pesanan berhasil dibuat' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Keranjang kosong atau stok tidak cukup' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('my-orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan seluruh riwayat pesanan milik customer yang login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar riwayat pesanan' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan detail faktur pesanan (Customer & Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detail pesanan' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderDetail", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
let AdminOrdersController = class AdminOrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async getAdminOrders(filter) {
        return this.ordersService.getAdminOrders(filter);
    }
    async updateOrderStatus(orderId, dto) {
        return this.ordersService.updateOrderStatus(orderId, dto);
    }
};
exports.AdminOrdersController = AdminOrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan seluruh pesanan di sistem toko FORME (Khusus Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar seluruh pesanan' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.GetOrdersFilterDto]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "getAdminOrders", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Memperbarui status pesanan (PROCESSING, SHIPPED, COMPLETED, CANCELLED)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status pesanan berhasil diubah' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "updateOrderStatus", null);
exports.AdminOrdersController = AdminOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Order Management'),
    (0, common_1.Controller)('admin/orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], AdminOrdersController);
//# sourceMappingURL=orders.controller.js.map