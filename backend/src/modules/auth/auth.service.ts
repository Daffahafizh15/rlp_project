import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar. Silakan gunakan email lain atau login.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Create user and initial cart in a transaction
    const newUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: dto.fullName.trim(),
          email: dto.email.toLowerCase().trim(),
          passwordHash,
          phone: dto.phone?.trim() || null,
          role: Role.CUSTOMER,
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password tidak sesuai');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password tidak sesuai');
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

  async getProfile(userId: string) {
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
      throw new NotFoundException('Profil pengguna tidak ditemukan');
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

  private generateToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }
}
