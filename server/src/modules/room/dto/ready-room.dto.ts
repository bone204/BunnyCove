import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ReadyRoomDto {
  @IsString()
  @IsNotEmpty()
  roomCode: string;

  @IsBoolean()
  @IsNotEmpty()
  isReady: boolean;
}
