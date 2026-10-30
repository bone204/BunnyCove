import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
import { NotificationsService } from './notifications.service.js';
import { QueryNotificationsDto } from './dto/query-notifications.dto.js';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get paginated notifications for the current user',
    description: 'Supports pagination (limit, offset) and filtering by read status (isRead).',
  })
  @ApiResponse({ status: 200, description: 'Notifications fetched successfully' })
  async getNotifications(
    @Req() request: Request,
    @Query() query: QueryNotificationsDto,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const result = await this.notificationsService.getUserNotifications(userId, query);
    return {
      success: true,
      code: ResponseCodes.NOTIFICATIONS_FETCHED,
      data: result,
    };
  }

  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get unread notification count for notification bell badge',
  })
  @ApiResponse({ status: 200, description: 'Unread count returned' })
  async getUnreadCount(@Req() request: Request) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const unreadCount = await this.notificationsService.getUnreadCount(userId);
    return {
      success: true,
      code: ResponseCodes.UNREAD_COUNT_FETCHED,
      data: { unreadCount },
    };
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark all unread notifications as read for current user',
  })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@Req() request: Request) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const result = await this.notificationsService.markAllAsRead(userId);
    return {
      success: true,
      code: ResponseCodes.ALL_NOTIFICATIONS_READ,
      data: result,
    };
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark a specific notification as read',
  })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(
    @Req() request: Request,
    @Param('id') notificationId: string,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const updated = await this.notificationsService.markAsRead(userId, notificationId);
    return {
      success: true,
      code: ResponseCodes.NOTIFICATION_READ,
      data: updated,
    };
  }

  @Post('fcm-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Register or update Firebase Cloud Messaging (FCM) device push token',
    description: 'Enables system push notifications when the app is in the background or killed.',
  })
  @ApiResponse({ status: 200, description: 'FCM token registered successfully' })
  async updateFcmToken(
    @Req() request: Request,
    @Body() dto: UpdateFcmTokenDto,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    await this.notificationsService.updateFcmToken(userId, dto.fcmToken);
    return {
      success: true,
      code: ResponseCodes.FCM_TOKEN_UPDATED,
      data: null,
    };
  }

  @Delete('fcm-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove FCM device token on logout',
  })
  @ApiResponse({ status: 200, description: 'FCM token cleared' })
  async clearFcmToken(@Req() request: Request) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    await this.notificationsService.clearFcmToken(userId);
    return {
      success: true,
      code: ResponseCodes.FCM_TOKEN_CLEARED,
      data: null,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a notification',
  })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async deleteNotification(
    @Req() request: Request,
    @Param('id') notificationId: string,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    await this.notificationsService.deleteNotification(userId, notificationId);
    return {
      success: true,
      code: ResponseCodes.NOTIFICATION_DELETED,
      data: null,
    };
  }
}
