import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'player@bunny-cove.com', description: 'Registered email or username' })
  @IsString()
  @IsNotEmpty()
  identifier: string; // can be email or username

  @ApiProperty({ example: 'Password123!', description: 'Account password' })
  @IsString()
  @MinLength(6)
  password: string;
}
