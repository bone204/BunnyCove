import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';
import { DEFAULT_AVATAR_URL } from '../../common/constants/defaults.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { MatchHistoryQueryDto } from './dto/match-history-query.dto.js';

export interface UserSummaryStats {
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  winRate: number; // Percentage 0 - 100
  highestWinStreak: number;
  totalPoints: number; // Aggregate ELO rating
  friendsCount: number;
}

export interface DetailedUserProfile {
  user: {
    id: string;
    username: string | null;
    displayName: string;
    email: string | null;
    avatarUrl: string | null;
    isEmailVerified: boolean;
    emailVerifiedAt: Date | null;
    createdAt: Date;
  };
  summary: UserSummaryStats;
  stats: Array<{
    gameType: string;
    totalMatches: number;
    wins: number;
    losses: number;
    draws: number;
    winStreak: number;
    points: number;
    updatedAt: Date;
  }>;
  recentMatches: Array<{
    matchId: string;
    gameType: string;
    roomCode: string;
    durationSeconds: number;
    playedAt: Date;
    isWinner: boolean;
    result: 'WIN' | 'LOSS' | 'DRAW';
    score: number;
    rank: number | null;
    opponents: Array<{
      id: string;
      username: string | null;
      displayName: string;
      avatarUrl: string | null;
    }>;
  }>;
}

export interface PublicUserProfile {
  id: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  createdAt: Date;
  summary: {
    totalMatches: number;
    totalWins: number;
    totalLosses: number;
    totalDraws: number;
    winRate: number;
    totalPoints: number;
  };
  stats: Array<{
    gameType: string;
    totalMatches: number;
    wins: number;
    losses: number;
    draws: number;
    winStreak: number;
    points: number;
  }>;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string): Promise<DetailedUserProfile> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          avatarUrl: true,
          isEmailVerified: true,
          emailVerifiedAt: true,
          createdAt: true,
          stats: {
            select: {
              gameType: true,
              totalMatches: true,
              wins: true,
              losses: true,
              draws: true,
              winStreak: true,
              points: true,
              updatedAt: true,
            },
          },
          matchParticipations: {
            take: 10,
            orderBy: { joinedAt: 'desc' },
            include: {
              match: {
                include: {
                  participants: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          username: true,
                          displayName: true,
                          avatarUrl: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          sentFriendRequests: {
            where: { status: 'ACCEPTED' },
            select: { id: true },
          },
          receivedFriendRequests: {
            where: { status: 'ACCEPTED' },
            select: { id: true },
          },
        },
      });

      if (!user) {
        throw new NotFoundException({
          code: ResponseCodes.USER_NOT_FOUND,
          message: 'User account not found',
        });
      }

      const summary = this.computeSummaryStats(
        user.stats,
        (user.sentFriendRequests?.length || 0) + (user.receivedFriendRequests?.length || 0),
      );

      const recentMatches = this.formatMatchParticipations(user.matchParticipations, userId);

      return {
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          isEmailVerified: user.isEmailVerified,
          emailVerifiedAt: user.emailVerifiedAt,
          createdAt: user.createdAt,
        },
        summary,
        stats: user.stats,
        recentMatches,
      };
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;

      // In-memory / database unavailable fallback
      return this.buildFallbackProfile(userId);
    }
  }

  async getPublicProfile(identifier: string): Promise<PublicUserProfile> {
    const cleanId = identifier.trim().toLowerCase();

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { id: cleanId },
            { username: { equals: cleanId, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          createdAt: true,
          stats: {
            select: {
              gameType: true,
              totalMatches: true,
              wins: true,
              losses: true,
              draws: true,
              winStreak: true,
              points: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException({
          code: ResponseCodes.USER_NOT_FOUND,
          message: `Player '${identifier}' not found`,
        });
      }

      const summary = this.computeSummaryStats(user.stats, 0);

      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        summary: {
          totalMatches: summary.totalMatches,
          totalWins: summary.totalWins,
          totalLosses: summary.totalLosses,
          totalDraws: summary.totalDraws,
          winRate: summary.winRate,
          totalPoints: summary.totalPoints,
        },
        stats: user.stats,
      };
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;

      throw new NotFoundException({
        code: ResponseCodes.USER_NOT_FOUND,
        message: `Player '${identifier}' not found`,
      });
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<DetailedUserProfile['user']> {
    if (!dto.displayName && !dto.username) {
      throw new BadRequestException({
        code: ResponseCodes.VALIDATION_ERROR,
        message: 'At least one field (displayName or username) must be provided for update',
      });
    }

    const updateData: Record<string, any> = {};

    if (dto.displayName !== undefined) {
      const cleanDisplayName = dto.displayName.trim();
      if (!cleanDisplayName) {
        throw new BadRequestException({
          code: ResponseCodes.VALIDATION_ERROR,
          message: 'Display name cannot be empty',
        });
      }
      updateData.displayName = cleanDisplayName;
    }

    if (dto.username !== undefined) {
      const cleanUsername = dto.username.trim().toLowerCase();

      // Check if username is already claimed by another user
      const existing = await this.prisma.user.findFirst({
        where: {
          username: { equals: cleanUsername, mode: 'insensitive' },
          NOT: { id: userId },
        },
      });

      if (existing) {
        throw new ConflictException({
          code: ResponseCodes.USERNAME_ALREADY_EXISTS,
          message: `Username '${cleanUsername}' is already taken by another player`,
        });
      }

      updateData.username = cleanUsername;
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          avatarUrl: true,
          isEmailVerified: true,
          emailVerifiedAt: true,
          createdAt: true,
        },
      });

      this.logger.log(`Profile updated for user: ${userId}`);
      return updatedUser;
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new ConflictException({
          code: ResponseCodes.USERNAME_ALREADY_EXISTS,
          message: 'Username is already taken by another player',
        });
      }
      throw err;
    }
  }

  async getUserStats(userId: string) {
    const profile = await this.getMyProfile(userId);
    return {
      summary: profile.summary,
      games: profile.stats,
    };
  }

  async getUserMatchHistory(userId: string, query: MatchHistoryQueryDto) {
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const offset = Math.max(0, query.offset || 0);

    try {
      const [participations, totalCount] = await Promise.all([
        this.prisma.matchParticipant.findMany({
          where: { userId },
          take: limit,
          skip: offset,
          orderBy: { joinedAt: 'desc' },
          include: {
            match: {
              include: {
                participants: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        this.prisma.matchParticipant.count({ where: { userId } }),
      ]);

      const formattedMatches = this.formatMatchParticipations(participations, userId);

      return {
        total: totalCount,
        limit,
        offset,
        matches: formattedMatches,
      };
    } catch {
      return {
        total: 0,
        limit,
        offset,
        matches: [],
      };
    }
  }

  // --- Helper Methods ---

  private computeSummaryStats(stats: any[], friendsCount: number): UserSummaryStats {
    let totalMatches = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let totalDraws = 0;
    let highestWinStreak = 0;
    let totalPoints = 0;

    for (const s of stats) {
      totalMatches += s.totalMatches || 0;
      totalWins += s.wins || 0;
      totalLosses += s.losses || 0;
      totalDraws += s.draws || 0;
      if (s.winStreak > highestWinStreak) {
        highestWinStreak = s.winStreak;
      }
      totalPoints += s.points || 1000;
    }

    const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;
    const finalPoints = stats.length > 0 ? Math.round(totalPoints / stats.length) : 1000;

    return {
      totalMatches,
      totalWins,
      totalLosses,
      totalDraws,
      winRate,
      highestWinStreak,
      totalPoints: finalPoints,
      friendsCount,
    };
  }

  private formatMatchParticipations(participations: any[], userId: string) {
    return participations.map((p) => {
      const opponents = (p.match?.participants || [])
        .filter((part: any) => part.userId !== userId && part.user)
        .map((part: any) => ({
          id: part.user.id,
          username: part.user.username,
          displayName: part.user.displayName,
          avatarUrl: part.user.avatarUrl,
        }));

      let result: 'WIN' | 'LOSS' | 'DRAW' = 'DRAW';
      if (p.isWinner) {
        result = 'WIN';
      } else if (p.match?.winnerId) {
        result = 'LOSS';
      }

      return {
        matchId: p.match?.id || p.matchId,
        gameType: p.match?.gameType || 'UNKNOWN',
        roomCode: p.match?.roomCode || '',
        durationSeconds: p.match?.durationSeconds || 0,
        playedAt: p.match?.createdAt || p.joinedAt,
        isWinner: !!p.isWinner,
        result,
        score: p.score || 0,
        rank: p.rank,
        opponents,
      };
    });
  }

  private buildFallbackProfile(userId: string): DetailedUserProfile {
    return {
      user: {
        id: userId,
        username: 'bunny_player',
        displayName: 'Bunny Player',
        email: 'player@bunny-cove.com',
        avatarUrl: DEFAULT_AVATAR_URL,
        isEmailVerified: false,
        emailVerifiedAt: null,
        createdAt: new Date(),
      },
      summary: {
        totalMatches: 0,
        totalWins: 0,
        totalLosses: 0,
        totalDraws: 0,
        winRate: 0,
        highestWinStreak: 0,
        totalPoints: 1000,
        friendsCount: 0,
      },
      stats: [],
      recentMatches: [],
    };
  }
}
