import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChatService } from './chat.service.js';
import { ChatHistoryQueryDto } from './dto/chat-history-query.dto.js';
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
}
