import { Room } from "../entities/room.entity";

export interface CreateRoomParams {
  hostName: string;
  avatarId: string;
}

export interface JoinRoomParams {
  code: string;
  playerName: string;
  avatarId: string;
}

export interface RoomRepository {
  createRoom(params: CreateRoomParams): Promise<Room>;
  joinRoom(params: JoinRoomParams): Promise<Room>;
  getRoom(code: string): Promise<Room>;
  toggleReady(code: string, isReady: boolean): Promise<Room>;
  leaveRoom(code: string): Promise<void>;
}

