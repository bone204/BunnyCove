import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'bunny_lover', description: 'Unique username for the player' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: 'Thỏ Trắng', description: 'Display name shown in games and chat' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  displayName: string;

  @ApiProperty({ example: 'player@bunny-cove.com', description: 'Unique email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Account password (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;
}
