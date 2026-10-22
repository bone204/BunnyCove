import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'player@bunny-cove.com', description: 'User account email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
