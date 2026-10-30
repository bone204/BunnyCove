import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { FriendsService } from './friends.service.js';
import { SendFriendRequestDto } from './dto/send-friend-request.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';

@ApiTags('Friends & Social')
@Controller('friends')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send a friend request to another player',
    description:
      'Target can be specified by user UUID or custom @username. Automatically accepts if a reverse request exists.',
  })
  @ApiResponse({ status: 200, description: 'Friend request sent or auto-accepted' })
  @ApiResponse({ status: 400, description: 'Cannot send request to yourself' })
  @ApiResponse({ status: 404, description: 'Target user not found' })
  @ApiResponse({ status: 409, description: 'Already friends or request already pending' })
  async sendFriendRequest(
    @Req() request: Request,
    @Body() dto: SendFriendRequestDto,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    return this.friendsService.sendFriendRequest(userId, dto);
  }

  @Post('accept/:friendshipId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Accept an incoming friend request',
  })
  @ApiParam({ name: 'friendshipId', description: 'Friendship UUID' })
  @ApiResponse({ status: 200, description: 'Friend request accepted' })
  @ApiResponse({ status: 403, description: 'Only recipient can accept this request' })
  @ApiResponse({ status: 404, description: 'Friend request not found' })
  async acceptFriendRequest(
    @Req() request: Request,
    @Param('friendshipId') friendshipId: string,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    return this.friendsService.acceptFriendRequest(userId, friendshipId);
  }

  @Post('reject/:friendshipId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reject an incoming friend request',
  })
  @ApiParam({ name: 'friendshipId', description: 'Friendship UUID' })
  @ApiResponse({ status: 200, description: 'Friend request rejected' })
  @ApiResponse({ status: 403, description: 'Only recipient can reject this request' })
  @ApiResponse({ status: 404, description: 'Friend request not found' })
  async rejectFriendRequest(
    @Req() request: Request,
    @Param('friendshipId') friendshipId: string,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    return this.friendsService.rejectFriendRequest(userId, friendshipId);
  }

  @Delete('cancel/:friendshipId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel an outgoing pending friend request',
  })
  @ApiParam({ name: 'friendshipId', description: 'Friendship UUID' })
  @ApiResponse({ status: 200, description: 'Friend request cancelled' })
  @ApiResponse({ status: 403, description: 'Only sender can cancel this request' })
  @ApiResponse({ status: 404, description: 'Friend request not found' })
  async cancelFriendRequest(
    @Req() request: Request,
    @Param('friendshipId') friendshipId: string,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    return this.friendsService.cancelFriendRequest(userId, friendshipId);
  }

  @Delete(':targetUserId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unfriend a player',
  })
  @ApiParam({ name: 'targetUserId', description: 'Friend user UUID' })
  @ApiResponse({ status: 200, description: 'Successfully unfriended' })
  @ApiResponse({ status: 404, description: 'Friendship not found' })
  async unfriend(
    @Req() request: Request,
    @Param('targetUserId') targetUserId: string,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    return this.friendsService.unfriend(userId, targetUserId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get list of accepted friends with online status and ranking points',
  })
  @ApiResponse({ status: 200, description: 'Friends list returned successfully' })
  async getFriendsList(@Req() request: Request) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const friends = await this.friendsService.getFriendsList(userId);
    return {
      success: true,
      code: ResponseCodes.FRIENDS_FETCHED,
      data: friends,
    };
  }

  @Get('requests')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all pending friend requests (both received and sent)',
  })
  @ApiResponse({ status: 200, description: 'Pending requests returned successfully' })
  async getPendingRequests(@Req() request: Request) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const requests = await this.friendsService.getPendingRequests(userId);
    return {
      success: true,
      code: ResponseCodes.FRIEND_REQUESTS_FETCHED,
      data: requests,
    };
  }

  @Get('status/:targetUserId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get friendship status between current user and target user',
    description: 'Returns SELF, NONE, PENDING_SENT, PENDING_RECEIVED, ACCEPTED, or BLOCKED.',
  })
  @ApiParam({ name: 'targetUserId', description: 'Target user UUID' })
  @ApiResponse({ status: 200, description: 'Friendship status returned successfully' })
  async getFriendshipStatus(
    @Req() request: Request,
    @Param('targetUserId') targetUserId: string,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const status = await this.friendsService.getFriendshipStatus(userId, targetUserId);
    return {
      success: true,
      code: ResponseCodes.FRIENDSHIP_STATUS_FETCHED,
      data: status,
    };
  }
}
