import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendVerificationDto {
  @ApiProperty({ example: 'player@bunny-cove.com', description: 'User registered email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
