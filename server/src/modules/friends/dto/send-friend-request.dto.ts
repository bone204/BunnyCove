import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendFriendRequestDto {
  @ApiProperty({
    example: 'bunny_champion',
    description: 'Target player identifier (can be User UUID or @username)',
  })
  @IsString()
  @IsNotEmpty()
  target: string;
}
