import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';
import { NotificationsGateway } from './notifications.gateway.js';
import { QueryNotificationsDto } from './dto/query-notifications.dto.js';
import { FirebaseService } from '../../common/firebase/firebase.service.js';
import { NotificationType } from '@prisma/client';

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  actorId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // In-memory fallback for testing / offline database mode
  private readonly inMemoryNotifications: Map<string, any> = new Map();
  private readonly inMemoryFcmTokens: Map<string, string> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createNotification(params: CreateNotificationParams) {
    let createdNotification: any;

    try {
      createdNotification = await this.prisma.notification.create({
        data: {
          userId: params.userId,
          actorId: params.actorId || null,
          type: params.type,
          title: params.title,
          body: params.body,
          metadata: params.metadata || {},
          isRead: false,
        },
        include: {
          actor: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });
    } catch {
      // Fallback in-memory notification
      createdNotification = {
        id: `noti-mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: params.userId,
        actorId: params.actorId || null,
        type: params.type,
        title: params.title,
        body: params.body,
        metadata: params.metadata || {},
        isRead: false,
        readAt: null,
        createdAt: new Date(),
        actor: null,
      };
      this.inMemoryNotifications.set(createdNotification.id, createdNotification);
    }

    // Dispatch real-time WebSocket push event to user if currently connected
    this.gateway.sendNotificationToUser(params.userId, createdNotification);

    // Dispatch remote FCM push notification to user device (e.g. when app is in background or offline)
    this.dispatchFcmPush(params, createdNotification).catch((err) => {
      this.logger.warn(`Failed to dispatch FCM push: ${err.message}`);
    });

    return createdNotification;
  }

  async getUserNotifications(userId: string, query: QueryNotificationsDto) {
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const offset = Math.max(0, query.offset || 0);

    const where: any = { userId };
    if (query.isRead !== undefined) {
      where.isRead = query.isRead;
    }

    try {
      const [notifications, total, unreadCount] = await Promise.all([
        this.prisma.notification.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
          include: {
            actor: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        }),
        this.prisma.notification.count({ where }),
        this.prisma.notification.count({ where: { userId, isRead: false } }),
      ]);

      return {
        total,
        unreadCount,
        limit,
        offset,
        notifications,
      };
    } catch {
      // In-memory fallback
      const allUserNotis = Array.from(this.inMemoryNotifications.values())
        .filter((n) => n.userId === userId && (query.isRead === undefined || n.isRead === query.isRead))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const unreadCount = allUserNotis.filter((n) => !n.isRead).length;
      const paginated = allUserNotis.slice(offset, offset + limit);

      return {
        total: allUserNotis.length,
        unreadCount,
        limit,
        offset,
        notifications: paginated,
      };
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await this.prisma.notification.count({
        where: { userId, isRead: false },
      });
    } catch {
      return Array.from(this.inMemoryNotifications.values()).filter(
        (n) => n.userId === userId && !n.isRead,
      ).length;
    }
  }

  async markAsRead(userId: string, notificationId: string) {
    try {
      const notification = await this.prisma.notification.findFirst({
        where: { id: notificationId, userId },
      });

      if (!notification) {
        throw new NotFoundException({
          code: ResponseCodes.NOTIFICATION_NOT_FOUND,
          message: 'Notification not found or access denied',
        });
      }

      const updated = await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return updated;
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;

      const memNoti = this.inMemoryNotifications.get(notificationId);
      if (!memNoti || memNoti.userId !== userId) {
        throw new NotFoundException({
          code: ResponseCodes.NOTIFICATION_NOT_FOUND,
          message: 'Notification not found or access denied',
        });
      }

      memNoti.isRead = true;
      memNoti.readAt = new Date();
      return memNoti;
    }
  }

  async markAllAsRead(userId: string) {
    const now = new Date();

    try {
      const result = await this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: {
          isRead: true,
          readAt: now,
        },
      });

      return { affected: result.count };
    } catch {
      let count = 0;
      for (const n of this.inMemoryNotifications.values()) {
        if (n.userId === userId && !n.isRead) {
          n.isRead = true;
          n.readAt = now;
          count++;
        }
      }
      return { affected: count };
    }
  }

  async deleteNotification(userId: string, notificationId: string) {
    try {
      const notification = await this.prisma.notification.findFirst({
        where: { id: notificationId, userId },
      });

      if (!notification) {
        throw new NotFoundException({
          code: ResponseCodes.NOTIFICATION_NOT_FOUND,
          message: 'Notification not found or access denied',
        });
      }

      await this.prisma.notification.delete({ where: { id: notificationId } });
      return true;
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;

      const memNoti = this.inMemoryNotifications.get(notificationId);
      if (!memNoti || memNoti.userId !== userId) {
        throw new NotFoundException({
          code: ResponseCodes.NOTIFICATION_NOT_FOUND,
          message: 'Notification not found or access denied',
        });
      }

      this.inMemoryNotifications.delete(notificationId);
      return true;
    }
  }

  isUserOnline(userId: string): boolean {
    return this.gateway.isUserOnline(userId);
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { fcmToken },
      });
    } catch {
      this.inMemoryFcmTokens.set(userId, fcmToken);
    }

    this.logger.log(`FCM device token updated for user ${userId}`);
    return { success: true };
  }

  async clearFcmToken(userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { fcmToken: null },
      });
    } catch {
      this.inMemoryFcmTokens.delete(userId);
    }

    this.logger.log(`FCM device token cleared for user ${userId}`);
    return { success: true };
  }

  private async dispatchFcmPush(params: CreateNotificationParams, notification: any) {
    let fcmToken: string | null = null;

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: params.userId },
        select: { fcmToken: true },
      });
      fcmToken = user?.fcmToken || null;
    } catch {
      fcmToken = this.inMemoryFcmTokens.get(params.userId) || null;
    }

    if (!fcmToken) return;

    // Build data payload with string key-value pairs required by FCM
    const dataPayload: Record<string, string> = {
      type: String(params.type),
      notificationId: String(notification.id),
    };

    if (params.metadata) {
      for (const [key, value] of Object.entries(params.metadata)) {
        if (value !== undefined && value !== null) {
          dataPayload[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
        }
      }
    }

    const result = await this.firebaseService.sendPushNotification({
      token: fcmToken,
      title: params.title,
      body: params.body,
      data: dataPayload,
    });

    // Self-healing: Automatically clear unregistered or invalid tokens
    if (
      !result.success &&
      (result.errorCode === 'messaging/registration-token-not-registered' ||
        result.errorCode === 'messaging/invalid-registration-token' ||
        result.errorCode === 'messaging/invalid-argument')
    ) {
      this.logger.warn(`Clearing invalid FCM token for user ${params.userId}: ${result.error}`);
      await this.clearFcmToken(params.userId);
    }
  }
}
