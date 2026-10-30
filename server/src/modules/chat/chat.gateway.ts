import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { RoomService } from '../room/room.service.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';
import { getStickerById } from '../../common/constants/stickers.constant.js';

export interface SendMessagePayload {
  roomCode?: string;
  text?: string;
  stickerId?: string;
  imageUrl?: string;
  type?: 'TEXT' | 'STICKER' | 'IMAGE' | 'SYSTEM';
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
  ) {}

  @SubscribeMessage('chat:send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessagePayload,
  ) {
    const room = this.roomService.getRoomBySocket(client.id);
    const roomCode = payload.roomCode?.trim().toUpperCase() || room?.code;

    if (!roomCode) {
      return {
        success: false,
        error: {
          code: ResponseCodes.ROOM_NOT_FOUND,
          message: 'Room not found or you are not in a room',
        },
      };
    }

    const player = room?.players.get(client.id);
    const senderName = player?.name || 'Bunny Player';
    const senderId = player?.id || client.id;
    const senderAvatar = player?.avatarId;

    let content = '';
    let messageType: 'TEXT' | 'STICKER' | 'IMAGE' | 'SYSTEM' = 'TEXT';
    let extraData: any = {};

    if (payload.stickerId) {
      if (!this.chatService.validateStickerId(payload.stickerId)) {
        return {
          success: false,
          error: {
            code: ResponseCodes.INVALID_STICKER,
            message: `Sticker '${payload.stickerId}' is invalid`,
          },
        };
      }
      content = payload.stickerId;
      messageType = 'STICKER';
      const stickerInfo = getStickerById(payload.stickerId);
      extraData = { sticker: stickerInfo };
    } else if (payload.imageUrl) {
      content = payload.imageUrl.trim();
      messageType = 'IMAGE';
    } else if (payload.text) {
      content = payload.text.trim();
      messageType = 'TEXT';
      if (!content) {
        return {
          success: false,
          error: {
            code: ResponseCodes.CHAT_MESSAGE_EMPTY,
            message: 'Chat message cannot be empty',
          },
        };
      }
    } else {
      return {
        success: false,
        error: {
          code: ResponseCodes.CHAT_MESSAGE_EMPTY,
          message: 'Either text, stickerId, or imageUrl must be provided',
        },
      };
    }

    const savedMessage = await this.chatService.saveMessage({
      roomCode,
      senderId,
      senderName,
      content,
      type: messageType,
    });

    const broadcastPayload = {
      ...savedMessage,
      senderAvatar,
      ...extraData,
    };

    // Broadcast to everyone in the room
    this.server.to(roomCode).emit('chat:new_message', {
      success: true,
      code: ResponseCodes.CHAT_MESSAGE_SENT,
      data: broadcastPayload,
    });

    this.logger.log(
      `Chat message (${messageType}) broadcasted to room ${roomCode} by ${senderName} (${client.id})`,
    );

    return {
      success: true,
      code: ResponseCodes.CHAT_MESSAGE_SENT,
      data: broadcastPayload,
    };
  }

  @SubscribeMessage('chat:send_sticker')
  async handleSendSticker(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomCode?: string; stickerId: string },
  ) {
    return this.handleSendMessage(client, {
      roomCode: payload.roomCode,
      stickerId: payload.stickerId,
      type: 'STICKER',
    });
  }
}
