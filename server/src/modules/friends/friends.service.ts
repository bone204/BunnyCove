import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';
import { SendFriendRequestDto } from './dto/send-friend-request.dto.js';

export interface FriendItem {
  id: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  friendshipId: string;
  since: Date;
  isOnline: boolean;
  totalPoints: number;
}

export interface PendingRequestsResult {
  received: Array<{
    friendshipId: string;
    createdAt: Date;
    sender: {
      id: string;
      username: string | null;
      displayName: string;
      avatarUrl: string | null;
    };
  }>;
  sent: Array<{
    friendshipId: string;
    createdAt: Date;
    receiver: {
      id: string;
      username: string | null;
      displayName: string;
      avatarUrl: string | null;
    };
  }>;
}

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);

  // In-memory fallback for testing / offline database mode
  private readonly inMemoryFriendships: Map<string, any> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async sendFriendRequest(senderId: string, dto: SendFriendRequestDto) {
    const cleanTarget = dto.target.trim().toLowerCase();

    // 1. Resolve target user by UUID or username
    const targetUser = await this.findUserByIdentifier(cleanTarget);
    if (!targetUser) {
      throw new NotFoundException({
        code: ResponseCodes.USER_NOT_FOUND,
        message: `Player '${dto.target}' not found`,
      });
    }

    // 2. Prevent self-friending
    if (senderId === targetUser.id) {
      throw new BadRequestException({
        code: ResponseCodes.CANNOT_FRIEND_SELF,
        message: 'You cannot send a friend request to yourself',
      });
    }

    // 3. Check sender user info for notification payload
    const sender = await this.findUserById(senderId);

    // 4. Check existing friendship in either direction
    const existing = await this.findFriendshipBetween(senderId, targetUser.id);

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        throw new ConflictException({
          code: ResponseCodes.ALREADY_FRIENDS,
          message: 'You are already friends with this player',
        });
      }

      if (existing.status === 'BLOCKED') {
        throw new ForbiddenException({
          code: ResponseCodes.USER_BLOCKED,
          message: 'Unable to send friend request to this player',
        });
      }

      if (existing.status === 'PENDING') {
        // If sender already sent a request
        if (existing.senderId === senderId) {
          throw new ConflictException({
            code: ResponseCodes.FRIEND_REQUEST_ALREADY_SENT,
            message: 'A friend request is already pending for this player',
          });
        }

        // If target already sent a request to sender -> Auto-accept!
        if (existing.senderId === targetUser.id) {
          return this.acceptFriendRequest(senderId, existing.id);
        }
      }
    }

    // 5. Create new pending friendship
    let createdFriendship: any;
    try {
      createdFriendship = await this.prisma.friendship.create({
        data: {
          senderId,
          receiverId: targetUser.id,
          status: 'PENDING',
        },
      });
    } catch {
      createdFriendship = {
        id: `friend-mock-${Date.now()}`,
        senderId,
        receiverId: targetUser.id,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryFriendships.set(createdFriendship.id, createdFriendship);
    }

    // 6. Trigger real-time and stored notification to receiver
    await this.notificationsService.createNotification({
      userId: targetUser.id,
      actorId: senderId,
      type: 'FRIEND_REQUEST',
      title: 'Lời mời kết bạn mới 🌸',
      body: `${sender?.displayName || 'Một người chơi'} (@${sender?.username || 'bunny'}) đã gửi cho bạn một lời mời kết bạn!`,
      metadata: {
        friendshipId: createdFriendship.id,
        senderId,
        senderUsername: sender?.username,
        senderDisplayName: sender?.displayName,
        senderAvatarUrl: sender?.avatarUrl,
      },
    });

    this.logger.log(`Friend request sent: ${senderId} -> ${targetUser.id}`);
    return {
      success: true,
      code: ResponseCodes.FRIEND_REQUEST_SENT,
      data: createdFriendship,
    };
  }

  async acceptFriendRequest(userId: string, friendshipId: string) {
    const friendship = await this.findFriendshipById(friendshipId);

    if (!friendship) {
      throw new NotFoundException({
        code: ResponseCodes.FRIEND_REQUEST_NOT_FOUND,
        message: 'Friend request not found',
      });
    }

    // Only the receiver can accept the friend request
    if (friendship.receiverId !== userId) {
      throw new ForbiddenException({
        code: ResponseCodes.FORBIDDEN,
        message: 'Only the recipient can accept this friend request',
      });
    }

    if (friendship.status === 'ACCEPTED') {
      return {
        success: true,
        code: ResponseCodes.FRIEND_REQUEST_ACCEPTED,
        data: friendship,
      };
    }

    const now = new Date();
    try {
      await this.prisma.friendship.update({
        where: { id: friendshipId },
        data: {
          status: 'ACCEPTED',
          updatedAt: now,
        },
      });
    } catch {
      friendship.status = 'ACCEPTED';
      friendship.updatedAt = now;
      this.inMemoryFriendships.set(friendshipId, friendship);
    }

    const receiver = await this.findUserById(userId);

    // Notify original sender that their request was accepted
    await this.notificationsService.createNotification({
      userId: friendship.senderId,
      actorId: userId,
      type: 'FRIEND_ACCEPTED',
      title: 'Đã trở thành bạn bè! 🎉',
      body: `${receiver?.displayName || 'Bạn mới'} đã chấp nhận lời mời kết bạn của bạn!`,
      metadata: {
        friendshipId,
        friendId: userId,
        friendUsername: receiver?.username,
        friendDisplayName: receiver?.displayName,
        friendAvatarUrl: receiver?.avatarUrl,
      },
    });

    this.logger.log(`Friend request accepted: ${friendshipId} by user ${userId}`);
    return {
      success: true,
      code: ResponseCodes.FRIEND_REQUEST_ACCEPTED,
      data: {
        ...friendship,
        status: 'ACCEPTED',
      },
    };
  }

  async rejectFriendRequest(userId: string, friendshipId: string) {
    const friendship = await this.findFriendshipById(friendshipId);

    if (!friendship) {
      throw new NotFoundException({
        code: ResponseCodes.FRIEND_REQUEST_NOT_FOUND,
        message: 'Friend request not found',
      });
    }

    // Only the receiver can reject the friend request
    if (friendship.receiverId !== userId) {
      throw new ForbiddenException({
        code: ResponseCodes.FORBIDDEN,
        message: 'Only the recipient can reject this friend request',
      });
    }

    try {
      await this.prisma.friendship.delete({ where: { id: friendshipId } });
    } catch {
      this.inMemoryFriendships.delete(friendshipId);
    }

    this.logger.log(`Friend request rejected: ${friendshipId} by user ${userId}`);
    return {
      success: true,
      code: ResponseCodes.FRIEND_REQUEST_REJECTED,
      data: null,
    };
  }

  async cancelFriendRequest(userId: string, friendshipId: string) {
    const friendship = await this.findFriendshipById(friendshipId);

    if (!friendship) {
      throw new NotFoundException({
        code: ResponseCodes.FRIEND_REQUEST_NOT_FOUND,
        message: 'Friend request not found',
      });
    }

    // Only the sender can cancel their pending friend request
    if (friendship.senderId !== userId) {
      throw new ForbiddenException({
        code: ResponseCodes.FORBIDDEN,
        message: 'Only the sender can cancel this pending friend request',
      });
    }

    try {
      await this.prisma.friendship.delete({ where: { id: friendshipId } });
    } catch {
      this.inMemoryFriendships.delete(friendshipId);
    }

    this.logger.log(`Friend request cancelled: ${friendshipId} by sender ${userId}`);
    return {
      success: true,
      code: ResponseCodes.FRIEND_REQUEST_CANCELLED,
      data: null,
    };
  }

  async unfriend(userId: string, targetUserId: string) {
    const friendship = await this.findFriendshipBetween(userId, targetUserId);

    if (!friendship || friendship.status !== 'ACCEPTED') {
      throw new NotFoundException({
        code: ResponseCodes.NOT_FOUND,
        message: 'No active friendship found with this player',
      });
    }

    try {
      await this.prisma.friendship.delete({ where: { id: friendship.id } });
    } catch {
      this.inMemoryFriendships.delete(friendship.id);
    }

    this.logger.log(`Unfriended: ${userId} <-> ${targetUserId}`);
    return {
      success: true,
      code: ResponseCodes.UNFRIENDED_SUCCESSFUL,
      data: null,
    };
  }

  async getFriendsList(userId: string): Promise<FriendItem[]> {
    try {
      const friendships = await this.prisma.friendship.findMany({
        where: {
          OR: [
            { senderId: userId, status: 'ACCEPTED' },
            { receiverId: userId, status: 'ACCEPTED' },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              stats: { select: { points: true } },
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              stats: { select: { points: true } },
            },
          },
        },
      });

      return friendships.map((f) => {
        const friend = f.senderId === userId ? f.receiver : f.sender;
        const totalPoints =
          friend.stats?.reduce((acc: number, s: any) => acc + s.points, 0) || 1000;

        return {
          id: friend.id,
          username: friend.username,
          displayName: friend.displayName,
          avatarUrl: friend.avatarUrl,
          friendshipId: f.id,
          since: f.createdAt,
          isOnline: this.notificationsService.isUserOnline(friend.id),
          totalPoints,
        };
      });
    } catch {
      // In-memory fallback
      return Array.from(this.inMemoryFriendships.values())
        .filter(
          (f) =>
            (f.senderId === userId || f.receiverId === userId) &&
            f.status === 'ACCEPTED',
        )
        .map((f) => {
          const friendId = f.senderId === userId ? f.receiverId : f.senderId;
          return {
            id: friendId,
            username: 'bunny_friend',
            displayName: 'Bunny Friend',
            avatarUrl: null,
            friendshipId: f.id,
            since: f.createdAt,
            isOnline: this.notificationsService.isUserOnline(friendId),
            totalPoints: 1000,
          };
        });
    }
  }

  async getPendingRequests(userId: string): Promise<PendingRequestsResult> {
    try {
      const [received, sent] = await Promise.all([
        this.prisma.friendship.findMany({
          where: { receiverId: userId, status: 'PENDING' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.friendship.findMany({
          where: { senderId: userId, status: 'PENDING' },
          include: {
            receiver: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return {
        received: received.map((r) => ({
          friendshipId: r.id,
          createdAt: r.createdAt,
          sender: r.sender,
        })),
        sent: sent.map((s) => ({
          friendshipId: s.id,
          createdAt: s.createdAt,
          receiver: s.receiver,
        })),
      };
    } catch {
      // In-memory fallback
      const allPending = Array.from(this.inMemoryFriendships.values()).filter(
        (f) => f.status === 'PENDING',
      );

      return {
        received: allPending
          .filter((f) => f.receiverId === userId)
          .map((f) => ({
            friendshipId: f.id,
            createdAt: f.createdAt,
            sender: {
              id: f.senderId,
              username: 'bunny_sender',
              displayName: 'Bunny Sender',
              avatarUrl: null,
            },
          })),
        sent: allPending
          .filter((f) => f.senderId === userId)
          .map((f) => ({
            friendshipId: f.id,
            createdAt: f.createdAt,
            receiver: {
              id: f.receiverId,
              username: 'bunny_receiver',
              displayName: 'Bunny Receiver',
              avatarUrl: null,
            },
          })),
      };
    }
  }

  async getFriendshipStatus(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      return { status: 'SELF' };
    }

    const friendship = await this.findFriendshipBetween(userId, targetUserId);
    if (!friendship) {
      return { status: 'NONE' };
    }

    if (friendship.status === 'ACCEPTED') {
      return { status: 'ACCEPTED', friendshipId: friendship.id };
    }

    if (friendship.status === 'BLOCKED') {
      return { status: 'BLOCKED' };
    }

    if (friendship.status === 'PENDING') {
      return {
        status: friendship.senderId === userId ? 'PENDING_SENT' : 'PENDING_RECEIVED',
        friendshipId: friendship.id,
      };
    }

    return { status: 'NONE' };
  }

  // --- Helpers ---

  private async findUserByIdentifier(identifier: string): Promise<any> {
    const cleanId = identifier.trim().toLowerCase();

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { id: cleanId },
            { username: { equals: cleanId, mode: 'insensitive' } },
          ],
        },
      });
      if (user) return user;
    } catch {
      // Fall through
    }

    return null;
  }

  private async findUserById(id: string): Promise<any> {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch {
      return null;
    }
  }

  private async findFriendshipById(id: string): Promise<any> {
    try {
      const f = await this.prisma.friendship.findUnique({ where: { id } });
      if (f) return f;
    } catch {
      // Fall through
    }

    return this.inMemoryFriendships.get(id);
  }

  private async findFriendshipBetween(userA: string, userB: string): Promise<any> {
    try {
      const f = await this.prisma.friendship.findFirst({
        where: {
          OR: [
            { senderId: userA, receiverId: userB },
            { senderId: userB, receiverId: userA },
          ],
        },
      });
      if (f) return f;
    } catch {
      // Fall through
    }

    return Array.from(this.inMemoryFriendships.values()).find(
      (f) =>
        (f.senderId === userA && f.receiverId === userB) ||
        (f.senderId === userB && f.receiverId === userA),
    );
  }
}
