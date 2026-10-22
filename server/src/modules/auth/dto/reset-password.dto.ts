import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'player@bunny-cove.com', description: 'User account email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code received in email (valid for 2 minutes)' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'New password for the account (minimum 6 characters)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
