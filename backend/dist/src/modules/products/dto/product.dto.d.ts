export declare class ProductImageDto {
    imageUrl: string;
    isPrimary?: boolean;
    sortOrder?: number;
}
export declare class ProductVariantDto {
    sku: string;
    size: string;
    color: string;
    price: number;
    stock: number;
}
export declare class CreateProductDto {
    categoryId: string;
    name: string;
    description: string;
    basePrice: number;
    images?: ProductImageDto[];
    variants: ProductVariantDto[];
}
export declare class UpdateProductDto {
    categoryId?: string;
    name?: string;
    description?: string;
    basePrice?: number;
    isActive?: boolean;
}
export declare class UpdateStockDto {
    stock: number;
}
export declare class GetProductsFilterDto {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
}
