import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SendStickerDto {
  @ApiProperty({ description: 'Room code where the sticker is sent', example: 'BUNNY-842' })
  @IsString()
  @IsNotEmpty()
  roomCode: string;

  @ApiProperty({ description: 'Bunny sticker ID', example: 'bunny_love' })
  @IsString()
  @IsNotEmpty()
  stickerId: string;
}
