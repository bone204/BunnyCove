import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Thỏ Trắng',
    description: 'Display name shown in games and chat',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  displayName: string;

  @ApiProperty({
    example: 'player@bunny-cove.com',
    description: 'Unique email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    example: 'bunny_thotrang',
    description: 'Custom unique username (auto-generated if omitted)',
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  username?: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Account password (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
