import { Injectable, Logger } from '@nestjs/common';
import { Room, Player } from './interfaces/room.interface.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';
import { GameRegistryService } from '../games/game-registry.service.js';
import { GameActionResult, GameInfo } from '../games/interfaces/game-engine.interface.js';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  private rooms: Map<string, Room> = new Map();
  private socketToRoom: Map<string, string> = new Map();
  private disconnectTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(private readonly gameRegistry: GameRegistryService) {}

  // Generate cute code like BUNNY-84
  private generateRoomCode(): string {
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const prefixes = ['BUNNY', 'HOPPY', 'COVE', 'CARROT', 'CLOVER'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix}-${randomSuffix}`;
  }

  createRoom(socketId: string, playerName: string, avatarId?: string): { roomCode: string; room: any } {
    this.leaveCurrentRoom(socketId);

    let roomCode = this.generateRoomCode();
    while (this.rooms.has(roomCode)) {
      roomCode = this.generateRoomCode();
    }

    const hostPlayer: Player = {
      id: socketId,
      socketId,
      name: playerName,
      avatarId: avatarId || 'bunny-default',
      isHost: true,
      isReady: false,
      isConnected: true,
    };

    const newRoom: Room = {
      code: roomCode,
      hostSocketId: socketId,
      players: new Map([[socketId, hostPlayer]]),
      status: 'WAITING',
      createdAt: Date.now(),
    };

    this.rooms.set(roomCode, newRoom);
    this.socketToRoom.set(socketId, roomCode);

    this.logger.log(`Room created: ${roomCode} by host: ${playerName} (${socketId})`);
    return { roomCode, room: this.serializeRoom(newRoom) };
  }

  joinRoom(
    socketId: string,
    roomCode: string,
    playerName: string,
    avatarId?: string,
  ): { success: boolean; code: string; room?: any; error?: string } {
    const formattedCode = roomCode.trim().toUpperCase();
    const room = this.rooms.get(formattedCode);

    if (!room) {
      return { success: false, code: ResponseCodes.ROOM_NOT_FOUND, error: 'Room not found' };
    }

    if (room.players.size >= 2 && !room.players.has(socketId)) {
      return { success: false, code: ResponseCodes.ROOM_FULL, error: 'Room is already full (max 2 players)' };
    }

    this.leaveCurrentRoom(socketId);

    const guestPlayer: Player = {
      id: socketId,
      socketId,
      name: playerName,
      avatarId: avatarId || 'bunny-guest',
      isHost: false,
      isReady: false,
      isConnected: true,
    };

    room.players.set(socketId, guestPlayer);
    this.socketToRoom.set(socketId, formattedCode);

    this.logger.log(`Player ${playerName} (${socketId}) joined room ${formattedCode}`);
    return { success: true, code: ResponseCodes.ROOM_JOINED, room: this.serializeRoom(room) };
  }

  setReady(socketId: string, isReady: boolean): { success: boolean; room?: any; bothReady?: boolean } {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return { success: false };

    const room = this.rooms.get(roomCode);
    if (!room) return { success: false };

    const player = room.players.get(socketId);
    if (!player) return { success: false };

    player.isReady = isReady;

    const playersList: Player[] = Array.from(room.players.values());
    const bothReady = playersList.length === 2 && playersList.every((p: Player) => p.isReady);

    if (room.status !== 'PLAYING') {
      room.status = bothReady ? 'READY' : 'WAITING';
    }

    return { success: true, room: this.serializeRoom(room), bothReady };
  }

  // --- Dynamic Pluggable Game Engine Integration ---

  getAvailableGames(): GameInfo[] {
    return this.gameRegistry.listAvailableGames();
  }

  startGame(socketId: string, gameType: string, config?: any): { success: boolean; code: string; roomCode?: string; state?: any; error?: string } {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return { success: false, code: ResponseCodes.ROOM_NOT_FOUND, error: 'Not in a room' };

    const room = this.rooms.get(roomCode);
    if (!room) return { success: false, code: ResponseCodes.ROOM_NOT_FOUND, error: 'Room not found' };

    const player = room.players.get(socketId);
    if (!player || !player.isHost) {
      return { success: false, code: ResponseCodes.FORBIDDEN, error: 'Only the host can start a game' };
    }

    const engine = this.gameRegistry.getEngine(gameType);
    if (!engine) {
      return { success: false, code: ResponseCodes.NOT_FOUND, error: `Game engine '${gameType}' not found` };
    }

    const players = Array.from(room.players.values());
    if (players.length < engine.minPlayers || players.length > engine.maxPlayers) {
      return { success: false, code: ResponseCodes.VALIDATION_ERROR, error: `Requires between ${engine.minPlayers} and ${engine.maxPlayers} players` };
    }

    room.selectedGame = gameType.toLowerCase();
    room.status = 'PLAYING';
    room.gameState = engine.initGame(players, config);

    this.logger.log(`Game [${engine.name}] started in room ${roomCode}`);
    return {
      success: true,
      code: ResponseCodes.GAME_STARTED,
      roomCode,
      state: engine.serializeState(room.gameState),
    };
  }

  handleGameAction(socketId: string, actionType: string, payload: any): GameActionResult & { roomCode?: string } {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return { success: false, code: ResponseCodes.ROOM_NOT_FOUND, error: 'Not in a room' };

    const room = this.rooms.get(roomCode);
    if (!room || !room.selectedGame || room.status !== 'PLAYING') {
      return { success: false, code: ResponseCodes.GAME_NOT_STARTED, error: 'No active game in this room' };
    }

    const player = room.players.get(socketId);
    if (!player) return { success: false, code: ResponseCodes.NOT_FOUND, error: 'Player not found' };

    const engine = this.gameRegistry.getEngine(room.selectedGame);
    if (!engine) return { success: false, code: ResponseCodes.NOT_FOUND, error: 'Game engine not found' };

    const result = engine.handleAction(room.gameState, player, actionType, payload);

    if (result.success && result.state) {
      room.gameState = result.state;
    }

    if (result.isGameOver) {
      room.status = 'READY';
      this.logger.log(`Game in ${roomCode} finished. Winner: ${result.winnerId ?? 'Draw'}`);
    }

    return { ...result, roomCode };
  }

  // --- End Dynamic Pluggable Game Engine Integration ---

  handleDisconnect(socketId: string, onGraceExpire: (roomCode: string, playerId: string) => void): string | null {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return null;

    const room = this.rooms.get(roomCode);
    if (!room) return null;

    const player = room.players.get(socketId);
    if (!player) return null;

    player.isConnected = false;
    player.disconnectedAt = Date.now();

    this.logger.warn(`Player ${player.name} (${socketId}) disconnected from ${roomCode}. 30s grace period started.`);

    const timer = setTimeout(() => {
      this.disconnectTimers.delete(socketId);
      this.removePlayerPermanently(socketId);
      onGraceExpire(roomCode, socketId);
    }, 30000);

    this.disconnectTimers.set(socketId, timer);
    return roomCode;
  }

  handleReconnect(oldSocketId: string, newSocketId: string, roomCode: string): boolean {
    const timer = this.disconnectTimers.get(oldSocketId);
    if (timer) {
      clearTimeout(timer);
      this.disconnectTimers.delete(oldSocketId);
    }

    const room = this.rooms.get(roomCode);
    if (!room) return false;

    const player = room.players.get(oldSocketId);
    if (!player) return false;

    room.players.delete(oldSocketId);
    this.socketToRoom.delete(oldSocketId);

    player.id = newSocketId;
    player.socketId = newSocketId;
    player.isConnected = true;
    player.disconnectedAt = undefined;

    room.players.set(newSocketId, player);
    this.socketToRoom.set(newSocketId, roomCode);

    if (room.hostSocketId === oldSocketId) {
      room.hostSocketId = newSocketId;
    }

    this.logger.log(`Player ${player.name} reconnected successfully with new socket: ${newSocketId}`);
    return true;
  }

  leaveCurrentRoom(socketId: string): string | null {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return null;

    this.removePlayerPermanently(socketId);
    return roomCode;
  }

  private removePlayerPermanently(socketId: string) {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return;

    this.socketToRoom.delete(socketId);
    const room = this.rooms.get(roomCode);
    if (!room) return;

    room.players.delete(socketId);

    if (room.players.size === 0) {
      this.rooms.delete(roomCode);
      this.logger.log(`Room ${roomCode} has been closed (no players left).`);
    } else {
      if (room.hostSocketId === socketId) {
        const remainingPlayer = room.players.values().next().value;
        if (remainingPlayer) {
          remainingPlayer.isHost = true;
          room.hostSocketId = remainingPlayer.socketId;
        }
      }
    }
  }

  getRoom(roomCode: string): any {
    const room = this.rooms.get(roomCode);
    return room ? this.serializeRoom(room) : null;
  }

  getRoomBySocket(socketId: string): Room | undefined {
    const roomCode = this.socketToRoom.get(socketId);
    return roomCode ? this.rooms.get(roomCode) : undefined;
  }

  serializeRoom(room: Room): any {
    return {
      code: room.code,
      hostSocketId: room.hostSocketId,
      status: room.status,
      selectedGame: room.selectedGame,
      players: Array.from(room.players.values()),
      createdAt: room.createdAt,
    };
  }
}
