import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiPropertyOptional({
    example: 'player@bunny-cove.com',
    description: 'Registered email or username',
  })
  @IsString()
  @IsOptional()
  identifier?: string;

  @ApiPropertyOptional({
    example: 'player@bunny-cove.com',
    description: 'Alternative email field for client compatibility',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Password123!', description: 'Account password' })
  @IsString()
  @MinLength(6)
  password: string;
}
