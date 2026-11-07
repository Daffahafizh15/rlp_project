import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Ahmad Pratama', description: 'Nama lengkap pengguna' })
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  fullName: string;

  @ApiProperty({ example: 'ahmad@example.com', description: 'Email unik pengguna' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Password minimal 6 karakter' })
  @IsString()
  @MinLength(6, { message: 'Password minimal terdiri dari 6 karakter' })
  password: string;

  @ApiPropertyOptional({ example: '081234567890', description: 'Nomor telepon/WhatsApp' })
  @IsOptional()
  @IsString()
  phone?: string;
}
