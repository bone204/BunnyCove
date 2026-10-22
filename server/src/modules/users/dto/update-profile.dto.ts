import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'Thỏ Hồng Siêu Cấp',
    description: 'Custom display name for games and chat (1-50 characters)',
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  displayName?: string;

  @ApiPropertyOptional({
    example: 'bunny_champion',
    description: 'Unique player username (3-30 characters, letters, numbers, and underscores only)',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain alphanumeric characters and underscores',
  })
  username?: string;
}
