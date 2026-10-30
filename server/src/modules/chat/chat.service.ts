import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import crypto from 'node:crypto';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';
import {
  BUNNY_STICKERS,
  QUICK_REACTIONS,
  isValidStickerId,
  BunnySticker,
  QuickReaction,
} from '../../common/constants/stickers.constant.js';
import { ChatHistoryQueryDto } from './dto/chat-history-query.dto.js';

export interface ChatMessageRecord {
  id: string;
  roomCode?: string | null;
  matchId?: string | null;
  senderId?: string | null;
  senderName: string;
  content: string;
  type: 'TEXT' | 'STICKER' | 'IMAGE' | 'SYSTEM';
  createdAt: Date;
}

export interface SaveMessageParams {
  roomCode?: string;
  matchId?: string;
  senderId?: string;
  senderName: string;
  content: string;
  type?: 'TEXT' | 'STICKER' | 'IMAGE' | 'SYSTEM';
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  // In-memory fallback message storage when database is offline
  private inMemoryMessages: ChatMessageRecord[] = [];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves the full collection of Bunny stickers and quick reactions.
   */
  getStickerCatalog(): {
    stickers: BunnySticker[];
    quickReactions: QuickReaction[];
  } {
    return {
      stickers: BUNNY_STICKERS,
      quickReactions: QUICK_REACTIONS,
    };
  }

  /**
   * Validates whether a sticker ID exists in the catalog.
   */
  validateStickerId(stickerId: string): boolean {
    return isValidStickerId(stickerId);
  }

  /**
   * Saves a chat message or sticker to persistent storage with resilient in-memory fallback.
   */
  async saveMessage(params: SaveMessageParams): Promise<ChatMessageRecord> {
    const cleanContent = params.content?.trim();
    if (!cleanContent) {
      throw new BadRequestException({
        code: ResponseCodes.CHAT_MESSAGE_EMPTY,
        message: 'Message content cannot be empty',
      });
    }

    const messageType = params.type || 'TEXT';

    if (messageType === 'STICKER' && !this.validateStickerId(cleanContent)) {
      throw new BadRequestException({
        code: ResponseCodes.INVALID_STICKER,
        message: `Sticker '${cleanContent}' is not a valid Bunny Cove sticker`,
      });
    }

    const messageRecord: ChatMessageRecord = {
      id: crypto.randomUUID(),
      roomCode: params.roomCode ? params.roomCode.toUpperCase() : null,
      matchId: params.matchId || null,
      senderId: params.senderId || null,
      senderName: params.senderName || 'Bunny Guest',
      content: cleanContent,
      type: messageType,
      createdAt: new Date(),
    };

    try {
      // Attempt database save via Prisma
      const dbSaved = await this.prisma.chatMessage.create({
        data: {
          id: messageRecord.id,
          roomCode: messageRecord.roomCode,
          matchId: messageRecord.matchId,
          senderId: messageRecord.senderId,
          senderName: messageRecord.senderName,
          content: messageRecord.content,
          type: messageRecord.type as any,
          createdAt: messageRecord.createdAt,
        },
      });

      return {
        id: dbSaved.id,
        roomCode: dbSaved.roomCode,
        matchId: dbSaved.matchId,
        senderId: dbSaved.senderId,
        senderName: dbSaved.senderName ?? messageRecord.senderName,
        content: dbSaved.content,
        type: dbSaved.type as any,
        createdAt: dbSaved.createdAt,
      };
    } catch (err: any) {
      this.logger.warn(
        `Failed to persist chat message in database (${err.message}). Storing in resilient in-memory fallback.`,
      );
      this.inMemoryMessages.push(messageRecord);
      return messageRecord;
    }
  }

  /**
   * Retrieves paginated chat messages for a specific room.
   */
  async getRoomMessages(
    roomCode: string,
    query?: ChatHistoryQueryDto,
  ): Promise<{ messages: ChatMessageRecord[]; total: number }> {
    const formattedCode = roomCode.trim().toUpperCase();
    const limit = query?.limit ?? 50;
    const offset = query?.offset ?? 0;

    try {
      const [messages, total] = await Promise.all([
        this.prisma.chatMessage.findMany({
          where: { roomCode: formattedCode },
          orderBy: { createdAt: 'asc' },
          skip: offset,
          take: limit,
        }),
        this.prisma.chatMessage.count({
          where: { roomCode: formattedCode },
        }),
      ]);

      const mapped: ChatMessageRecord[] = messages.map((m) => ({
        id: m.id,
        roomCode: m.roomCode,
        matchId: m.matchId,
        senderId: m.senderId,
        senderName: m.senderName ?? 'Bunny Player',
        content: m.content,
        type: m.type as any,
        createdAt: m.createdAt,
      }));

      return { messages: mapped, total };
    } catch {
      // In-memory fallback
      const filtered = this.inMemoryMessages.filter(
        (m) => m.roomCode === formattedCode,
      );
      const paginated = filtered.slice(offset, offset + limit);
      return { messages: paginated, total: filtered.length };
    }
  }

  /**
   * Retrieves paginated chat messages for a specific match.
   */
  async getMatchMessages(
    matchId: string,
    query?: ChatHistoryQueryDto,
  ): Promise<{ messages: ChatMessageRecord[]; total: number }> {
    const limit = query?.limit ?? 50;
    const offset = query?.offset ?? 0;

    try {
      const [messages, total] = await Promise.all([
        this.prisma.chatMessage.findMany({
          where: { matchId },
          orderBy: { createdAt: 'asc' },
          skip: offset,
          take: limit,
        }),
        this.prisma.chatMessage.count({
          where: { matchId },
        }),
      ]);

      const mapped: ChatMessageRecord[] = messages.map((m) => ({
        id: m.id,
        roomCode: m.roomCode,
        matchId: m.matchId,
        senderId: m.senderId,
        senderName: m.senderName ?? 'Bunny Player',
        content: m.content,
        type: m.type as any,
        createdAt: m.createdAt,
      }));

      return { messages: mapped, total };
    } catch {
      const filtered = this.inMemoryMessages.filter((m) => m.matchId === matchId);
      const paginated = filtered.slice(offset, offset + limit);
      return { messages: paginated, total: filtered.length };
    }
  }
}
