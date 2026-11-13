export interface Player {
  id: string;
  socketId: string;
  name: string;
  avatarId: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
}

export type RoomStatus = "WAITING" | "READY" | "PLAYING" | "PAUSED";

export interface Room {
  code: string;
  hostSocketId: string;
  status: RoomStatus;
  maxPlayers: number;
  players: Player[];
  currentGame?: string | null;
  createdAt: number;
}
