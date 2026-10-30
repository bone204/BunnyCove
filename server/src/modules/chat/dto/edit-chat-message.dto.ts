import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class EditChatMessageDto {
  @ApiProperty({
    description: 'Updated text content of the message',
    example: 'Updated message content 🐰',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text: string;
}
