import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateProductDto, GetProductsFilterDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    private slugify;
    findAll(filter: GetProductsFilterDto): Promise<{
        message: string;
        data: {
            items: {
                id: string;
                name: string;
                slug: string;
                basePrice: import("@prisma/client/runtime/library").Decimal;
                category: {
                    id: string;
                    name: string;
                    slug: string;
                };
                primaryImage: string;
                availableSizes: string[];
                availableColors: string[];
                totalStock: number;
                inStock: boolean;
                createdAt: Date;
            }[];
            pagination: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                limit: number;
            };
        };
    }>;
    findOne(identifier: string): Promise<{
        message: string;
        data: {
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
                slug: string;
            };
            variants: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                productId: string;
                sku: string;
                size: string;
                color: string;
                price: import("@prisma/client/runtime/library").Decimal;
                stock: number;
            }[];
            images: {
                id: string;
                imageUrl: string;
                isPrimary: boolean;
                sortOrder: number;
                productId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string;
            isActive: boolean;
            slug: string;
            categoryId: string;
            basePrice: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    findAdminProduct(id: string): Promise<{
        message: string;
        data: {
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
                slug: string;
            };
            variants: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                productId: string;
                sku: string;
                size: string;
                color: string;
                price: import("@prisma/client/runtime/library").Decimal;
                stock: number;
            }[];
            images: {
                id: string;
                imageUrl: string;
                isPrimary: boolean;
                sortOrder: number;
                productId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string;
            isActive: boolean;
            slug: string;
            categoryId: string;
            basePrice: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    create(dto: CreateProductDto): Promise<{
        message: string;
        data: {
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
                slug: string;
            };
            variants: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                productId: string;
                sku: string;
                size: string;
                color: string;
                price: import("@prisma/client/runtime/library").Decimal;
                stock: number;
            }[];
            images: {
                id: string;
                imageUrl: string;
                isPrimary: boolean;
                sortOrder: number;
                productId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string;
            isActive: boolean;
            slug: string;
            categoryId: string;
            basePrice: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string;
            isActive: boolean;
            slug: string;
            categoryId: string;
            basePrice: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    updateVariantStock(variantId: string, newStock: number): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            productId: string;
            sku: string;
            size: string;
            color: string;
            price: import("@prisma/client/runtime/library").Decimal;
            stock: number;
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
