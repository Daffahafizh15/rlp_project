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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email sudah terdaftar. Silakan gunakan email lain atau login.');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const newUser = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    fullName: dto.fullName.trim(),
                    email: dto.email.toLowerCase().trim(),
                    passwordHash,
                    phone: dto.phone?.trim() || null,
                    role: client_1.Role.CUSTOMER,
                },
            });
            await tx.cart.create({
                data: {
                    userId: user.id,
                },
            });
            return user;
        });
        const token = this.generateToken(newUser.id, newUser.email, newUser.role);
        return {
            message: 'Registrasi berhasil. Selamat datang di FORME!',
            data: {
                accessToken: token,
                user: {
                    id: newUser.id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    phone: newUser.phone,
                    role: newUser.role,
                },
            },
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email atau password tidak sesuai');
        }
        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email atau password tidak sesuai');
        }
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            message: 'Login berhasil',
            data: {
                accessToken: token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
            },
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                addresses: {
                    orderBy: { isDefault: 'desc' },
                    include: {
                        shippingZone: true,
                    },
                },
                cart: {
                    include: {
                        items: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Profil pengguna tidak ditemukan');
        }
        const totalCartItems = user.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
        return {
            message: 'Profil pengguna berhasil dimuat',
            data: {
                ...user,
                cartCount: totalCartItems,
            },
        };
    }
    generateToken(userId, email, role) {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map