import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import type { Request } from 'express';
import { ChatService } from './chat.service.js';
import { ChatHistoryQueryDto } from './dto/chat-history-query.dto.js';
import { EditChatMessageDto } from './dto/edit-chat-message.dto.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';

@ApiTags('Chat & Stickers')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('stickers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve all available Bunny stickers and canned quick reactions',
  })
  @ApiResponse({
    status: 200,
    description: 'Sticker catalog retrieved successfully',
  })
  getStickers() {
    const data = this.chatService.getStickerCatalog();
    return {
      success: true,
      code: ResponseCodes.STICKERS_FETCHED,
      data,
    };
  }

  @Get('rooms/:roomCode/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve chat message history for a specific room',
  })
  @ApiParam({ name: 'roomCode', description: 'Room Code (e.g. BUNNY-842)' })
  @ApiResponse({
    status: 200,
    description: 'Room chat message history retrieved',
  })
  async getRoomMessages(
    @Param('roomCode') roomCode: string,
    @Query() query: ChatHistoryQueryDto,
  ) {
    const data = await this.chatService.getRoomMessages(roomCode, query);
    return {
      success: true,
      code: ResponseCodes.CHAT_HISTORY_FETCHED,
      data,
    };
  }

  @Get('matches/:matchId/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve chat message history for a specific match',
  })
  @ApiParam({ name: 'matchId', description: 'Match UUID' })
  @ApiResponse({
    status: 200,
    description: 'Match chat message history retrieved',
  })
  async getMatchMessages(
    @Param('matchId') matchId: string,
    @Query() query: ChatHistoryQueryDto,
  ) {
    const data = await this.chatService.getMatchMessages(matchId, query);
    return {
      success: true,
      code: ResponseCodes.CHAT_HISTORY_FETCHED,
      data,
    };
  }

  @Patch('messages/:messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edit an existing text chat message' })
  @ApiParam({ name: 'messageId', description: 'Message UUID' })
  @ApiResponse({ status: 200, description: 'Message edited successfully' })
  @ApiResponse({ status: 400, description: 'Empty text or cannot edit sticker' })
  @ApiResponse({ status: 403, description: 'Not the owner of the message' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async editMessage(
    @Param('messageId') messageId: string,
    @Body() dto: EditChatMessageDto,
    @Req() request: Request,
  ) {
    const senderId = (request as any).user?.id;
    const data = await this.chatService.editMessage(messageId, senderId, dto.text);
    return {
      success: true,
      code: ResponseCodes.CHAT_MESSAGE_EDITED,
      data,
    };
  }

  @Delete('messages/:messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recall / Delete a chat message' })
  @ApiParam({ name: 'messageId', description: 'Message UUID' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  @ApiResponse({ status: 403, description: 'Not the owner of the message' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async deleteMessage(
    @Param('messageId') messageId: string,
    @Req() request: Request,
  ) {
    const senderId = (request as any).user?.id;
    const data = await this.chatService.deleteMessage(messageId, senderId);
    return {
      success: true,
      code: ResponseCodes.CHAT_MESSAGE_DELETED,
      data,
    };
  }
}
