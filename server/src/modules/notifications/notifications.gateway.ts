import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ResponseCodes } from '../../common/constants/response-codes.js';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly socketToUser: Map<string, string> = new Map();
  private readonly userToSockets: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Notification client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Notification client disconnected: ${client.id}`);
    const userId = this.socketToUser.get(client.id);
    if (userId) {
      this.socketToUser.delete(client.id);
      const userSockets = this.userToSockets.get(userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.userToSockets.delete(userId);
        }
      }
    }
  }

  @SubscribeMessage('notification:subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    if (!payload?.userId) {
      return { success: false, error: 'userId is required' };
    }

    const userId = payload.userId;
    this.socketToUser.set(client.id, userId);

    if (!this.userToSockets.has(userId)) {
      this.userToSockets.set(userId, new Set());
    }
    this.userToSockets.get(userId)!.add(client.id);

    client.join(`user:${userId}`);
    this.logger.log(`Socket ${client.id} subscribed to notifications for user ${userId}`);

    return {
      success: true,
      code: ResponseCodes.SUCCESS,
      message: `Subscribed to notifications for user ${userId}`,
    };
  }

  sendNotificationToUser(userId: string, notification: any): void {
    if (!this.server) return;

    this.server.to(`user:${userId}`).emit('notification:new', {
      success: true,
      code: 'new_notification',
      data: notification,
    });

    this.logger.log(`Dispatched real-time notification to user ${userId} [Type: ${notification.type}]`);
  }

  isUserOnline(userId: string): boolean {
    const sockets = this.userToSockets.get(userId);
    return !!(sockets && sockets.size > 0);
  }
}
