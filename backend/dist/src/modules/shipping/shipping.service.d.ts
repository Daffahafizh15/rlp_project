import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateShippingZoneDto, UpdateShippingZoneDto } from './dto/shipping-zone.dto';
export declare class ShippingService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(includeInactive?: boolean): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            rate: import("@prisma/client/runtime/library").Decimal;
            isActive: boolean;
        }[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            rate: import("@prisma/client/runtime/library").Decimal;
            isActive: boolean;
        };
    }>;
    create(dto: CreateShippingZoneDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            rate: import("@prisma/client/runtime/library").Decimal;
            isActive: boolean;
        };
    }>;
    update(id: string, dto: UpdateShippingZoneDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            rate: import("@prisma/client/runtime/library").Decimal;
            isActive: boolean;
        };
    }>;
    delete(id: string): Promise<{
        message: string;
        data: {
            deactivated: boolean;
            deleted?: undefined;
        };
    } | {
        message: string;
        data: {
            deleted: boolean;
            deactivated?: undefined;
        };
    }>;
}
