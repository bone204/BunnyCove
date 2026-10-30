import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';

export enum ChatMessageTypeDto {
  TEXT = 'TEXT',
  STICKER = 'STICKER',
  IMAGE = 'IMAGE',
  SYSTEM = 'SYSTEM',
}

export class SendChatMessageDto {
  @ApiProperty({ description: 'Room code where the message is sent', example: 'BUNNY-842' })
  @IsString()
  @IsNotEmpty()
  roomCode: string;

  @ApiPropertyOptional({ description: 'Text message content', example: 'Hello everyone! 🐰' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  text?: string;

  @ApiPropertyOptional({ description: 'Sticker ID from bunny sticker catalog', example: 'bunny_happy' })
  @IsOptional()
  @IsString()
  stickerId?: string;

  @ApiPropertyOptional({ description: 'Optional uploaded image URL', example: 'https://res.cloudinary.com/...' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ enum: ChatMessageTypeDto, default: ChatMessageTypeDto.TEXT })
  @IsOptional()
  @IsEnum(ChatMessageTypeDto)
  type?: ChatMessageTypeDto;
}
