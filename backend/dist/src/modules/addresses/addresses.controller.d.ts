import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    findAll(userId: string): Promise<{
        message: string;
        data: ({
            shippingZone: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                rate: import("@prisma/client/runtime/library").Decimal;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            recipientName: string;
            phoneNumber: string;
            fullAddress: string;
            city: string;
            province: string;
            postalCode: string;
            isDefault: boolean;
            shippingZoneId: string;
        })[];
    }>;
    findOne(userId: string, id: string): Promise<{
        message: string;
        data: {
            shippingZone: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                rate: import("@prisma/client/runtime/library").Decimal;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            recipientName: string;
            phoneNumber: string;
            fullAddress: string;
            city: string;
            province: string;
            postalCode: string;
            isDefault: boolean;
            shippingZoneId: string;
        };
    }>;
    create(userId: string, dto: CreateAddressDto): Promise<{
        message: string;
        data: {
            shippingZone: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                rate: import("@prisma/client/runtime/library").Decimal;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            recipientName: string;
            phoneNumber: string;
            fullAddress: string;
            city: string;
            province: string;
            postalCode: string;
            isDefault: boolean;
            shippingZoneId: string;
        };
    }>;
    update(userId: string, id: string, dto: UpdateAddressDto): Promise<{
        message: string;
        data: {
            shippingZone: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                rate: import("@prisma/client/runtime/library").Decimal;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            recipientName: string;
            phoneNumber: string;
            fullAddress: string;
            city: string;
            province: string;
            postalCode: string;
            isDefault: boolean;
            shippingZoneId: string;
        };
    }>;
    setDefault(userId: string, id: string): Promise<{
        message: string;
        data: {
            id: string;
            isDefault: boolean;
        };
    }>;
    delete(userId: string, id: string): Promise<{
        message: string;
        data: any;
    }>;
}
