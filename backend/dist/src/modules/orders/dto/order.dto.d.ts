import { OrderStatus, PaymentMethod } from '@prisma/client';
export declare class CreateOrderDto {
    addressId: string;
    paymentMethod: PaymentMethod;
    notes?: string;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
    trackingNumber?: string;
}
export declare class GetOrdersFilterDto {
    status?: OrderStatus;
    search?: string;
}
