export interface Player {
  id: string; // socket.id or user.id
  socketId: string;
  name: string;
  avatarId?: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  disconnectedAt?: number;
}

export type RoomStatus = 'WAITING' | 'READY' | 'PLAYING' | 'PAUSED';

export interface Room {
  code: string; // e.g. BUNNY-92
  hostSocketId: string;
  players: Map<string, Player>;
  status: RoomStatus;
  selectedGame?: string; // Dynamic game type (e.g. 'caro', 'bingo', etc.)
  gameState?: any;       // Dynamic game state managed by the active game engine
  createdAt: number;
}
