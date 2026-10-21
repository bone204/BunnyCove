import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  roomCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  playerName: string;

  @IsString()
  @IsOptional()
  avatarId?: string;
}
