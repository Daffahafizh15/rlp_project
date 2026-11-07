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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        const categories = await this.prisma.category.findMany({
            where,
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        return {
            message: 'Daftar kategori berhasil dimuat',
            data: categories,
        };
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                products: {
                    where: { isActive: true },
                    include: {
                        images: { where: { isPrimary: true }, take: 1 },
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Kategori tidak ditemukan');
        }
        return {
            message: 'Detail kategori berhasil dimuat',
            data: category,
        };
    }
    async create(dto) {
        const slug = this.slugify(dto.name);
        const existing = await this.prisma.category.findUnique({ where: { slug } });
        if (existing) {
            throw new common_1.ConflictException(`Kategori dengan nama/slug "${slug}" sudah ada`);
        }
        const category = await this.prisma.category.create({
            data: {
                name: dto.name.trim(),
                slug,
                description: dto.description?.trim() || null,
                isActive: dto.isActive !== undefined ? dto.isActive : true,
            },
        });
        return {
            message: 'Kategori baru berhasil dibuat',
            data: category,
        };
    }
    async update(id, dto) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Kategori tidak ditemukan');
        }
        let slug = category.slug;
        if (dto.name && dto.name.trim() !== category.name) {
            slug = this.slugify(dto.name);
            const duplicate = await this.prisma.category.findFirst({
                where: { slug, NOT: { id } },
            });
            if (duplicate) {
                throw new common_1.ConflictException(`Slug kategori "${slug}" sudah digunakan`);
            }
        }
        const updated = await this.prisma.category.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name.trim(), slug }),
                ...(dto.description !== undefined && { description: dto.description?.trim() || null }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });
        return {
            message: 'Kategori berhasil diperbarui',
            data: updated,
        };
    }
    async delete(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { products: true } } },
        });
        if (!category) {
            throw new common_1.NotFoundException('Kategori tidak ditemukan');
        }
        if (category._count.products > 0) {
            throw new common_1.ConflictException(`Kategori tidak dapat dihapus karena masih memuat ${category._count.products} produk. Nonaktifkan kategori sebagai alternatif.`);
        }
        await this.prisma.category.delete({ where: { id } });
        return {
            message: 'Kategori berhasil dihapus',
            data: null,
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map