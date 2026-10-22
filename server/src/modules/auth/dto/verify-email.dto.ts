import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'player@bunny-cove.com', description: 'User registered email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code received in email (valid for 2 minutes)' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
