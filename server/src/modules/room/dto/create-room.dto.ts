import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  playerName: string;

  @IsString()
  @IsOptional()
  avatarId?: string;

  @IsOptional()
  maxPlayers?: number;
}
