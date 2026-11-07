import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(includeInactive?: string): Promise<{
        message: string;
        data: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            slug: string;
        })[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
            products: ({
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
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            slug: string;
        };
    }>;
    create(dto: CreateCategoryDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            slug: string;
        };
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            slug: string;
        };
    }>;
    delete(id: string): Promise<{
        message: string;
        data: any;
    }>;
}
