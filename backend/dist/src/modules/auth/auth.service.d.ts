import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            user: {
                id: string;
                fullName: string;
                email: string;
                phone: string;
                role: import(".prisma/client").$Enums.Role;
            };
        };
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            user: {
                id: string;
                fullName: string;
                email: string;
                phone: string;
                role: import(".prisma/client").$Enums.Role;
            };
        };
    }>;
    getProfile(userId: string): Promise<{
        message: string;
        data: {
            cartCount: number;
            id: string;
            fullName: string;
            email: string;
            phone: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            addresses: ({
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
            cart: {
                items: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    cartId: string;
                    variantId: string;
                    quantity: number;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
        };
    }>;
    private generateToken;
}
