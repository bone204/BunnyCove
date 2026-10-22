import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MatchHistoryQueryDto {
  @ApiPropertyOptional({
    default: 10,
    minimum: 1,
    maximum: 50,
    description: 'Number of recent matches to return (1-50)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({
    default: 0,
    minimum: 0,
    description: 'Offset count for paginated match history',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
