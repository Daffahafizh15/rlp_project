import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'customer@forme.com', description: 'Alamat email terdaftar' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @ApiProperty({ example: 'CustomerFORME2026!', description: 'Password akun' })
  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;
}
