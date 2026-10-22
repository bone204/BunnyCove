import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateFcmTokenDto {
  @ApiProperty({
    description: 'Firebase Cloud Messaging (FCM) device registration token',
    example: 'dK9x_sample_fcm_token_from_mobile_device_xyz123',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  fcmToken: string;
}
