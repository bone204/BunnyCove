import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RoomService } from './room.service.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { JoinRoomDto } from './dto/join-room.dto.js';
import { ReadyRoomDto } from './dto/ready-room.dto.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RoomGateway.name);

  constructor(private readonly roomService: RoomService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const roomCode = this.roomService.handleDisconnect(client.id, (code: string, expiredPlayerId: string) => {
      this.server.to(code).emit('room:player_left', {
        success: true,
        code: ResponseCodes.ROOM_LEFT,
        data: {
          playerId: expiredPlayerId,
          reason: 'grace_period_expired',
        },
      });
    });

    if (roomCode) {
      this.server.to(roomCode).emit('room:player_disconnected', {
        success: true,
        code: ResponseCodes.ROOM_PLAYER_DISCONNECTED,
        data: {
          playerId: client.id,
          gracePeriodSeconds: 30,
        },
      });
    }
  }

  @SubscribeMessage('room:create')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateRoomDto,
  ) {
    const { roomCode, room } = this.roomService.createRoom(
      client.id,
      dto.playerName,
      dto.avatarId,
      dto.maxPlayers,
    );

    await client.join(roomCode);

    return {
      success: true,
      code: ResponseCodes.ROOM_CREATED,
      data: room,
    };
  }

  @SubscribeMessage('room:join')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    const result = this.roomService.joinRoom(
      client.id,
      dto.roomCode,
      dto.playerName,
      dto.avatarId,
    );

    if (!result.success) {
      return {
        success: false,
        error: {
          code: result.code,
          message: result.error,
        },
      };
    }

    await client.join(dto.roomCode.toUpperCase());

    this.server.to(dto.roomCode.toUpperCase()).emit('room:player_joined', {
      success: true,
      code: ResponseCodes.ROOM_JOINED,
      data: result.room,
    });

    return {
      success: true,
      code: ResponseCodes.ROOM_JOINED,
      data: result.room,
    };
  }

  @SubscribeMessage('room:ready')
  handleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: ReadyRoomDto,
  ) {
    const result = this.roomService.setReady(client.id, dto.isReady);

    if (!result.success) {
      return {
        success: false,
        error: {
          code: ResponseCodes.ROOM_NOT_FOUND,
          message: 'Unable to update ready status',
        },
      };
    }

    this.server.to(dto.roomCode.toUpperCase()).emit('room:ready_update', {
      success: true,
      code: result.bothReady ? ResponseCodes.ROOM_BOTH_READY : ResponseCodes.ROOM_PLAYER_READY,
      data: result.room,
    });

    return {
      success: true,
      code: ResponseCodes.ROOM_PLAYER_READY,
      data: result.room,
    };
  }

  @SubscribeMessage('room:leave')
  async handleLeaveRoom(@ConnectedSocket() client: Socket) {
    const roomCode = this.roomService.leaveCurrentRoom(client.id);

    if (roomCode) {
      await client.leave(roomCode);
      this.server.to(roomCode).emit('room:player_left', {
        success: true,
        code: ResponseCodes.ROOM_LEFT,
        data: {
          playerId: client.id,
          reason: 'manual_leave',
        },
      });
    }

    return {
      success: true,
      code: ResponseCodes.ROOM_LEFT,
      data: null,
    };
  }

  // --- Extensible Generic Game Actions ---

  @SubscribeMessage('game:list')
  handleListGames() {
    return {
      success: true,
      code: ResponseCodes.SUCCESS,
      data: this.roomService.getAvailableGames(),
    };
  }

  @SubscribeMessage('game:start')
  handleStartGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameType: string; config?: any },
  ) {
    const result = this.roomService.startGame(client.id, payload.gameType, payload.config);

    if (!result.success) {
      return {
        success: false,
        error: {
          code: result.code,
          message: result.error,
        },
      };
    }

    // Broadcast to room that game has started
    if (result.roomCode) {
      this.server.to(result.roomCode).emit('game:started', {
        success: true,
        code: ResponseCodes.GAME_STARTED,
        data: {
          gameType: payload.gameType,
          state: result.state,
        },
      });
    }

    return result;
  }

  @SubscribeMessage('game:action')
  handleGameAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { actionType: string; payload: any },
  ) {
    const result = this.roomService.handleGameAction(client.id, payload.actionType, payload.payload);

    if (!result.success) {
      return {
        success: false,
        error: {
          code: result.code,
          message: result.error,
        },
      };
    }

    // Broadcast updated state to room
    if (result.roomCode) {
      this.server.to(result.roomCode).emit('game:state_update', {
        success: true,
        code: result.code,
        data: {
          state: result.state,
          nextTurnPlayerId: result.nextTurnPlayerId,
        },
      });

      if (result.isGameOver) {
        this.server.to(result.roomCode).emit('game:over', {
          success: true,
          code: ResponseCodes.SUCCESS,
          data: {
            winnerId: result.winnerId,
            winningDetails: result.winningDetails,
          },
        });
      }
    }

    return result;
  }
}
