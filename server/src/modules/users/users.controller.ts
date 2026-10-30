import {
  Controller,
  Get,
  Patch,
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
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { MatchHistoryQueryDto } from './dto/match-history-query.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';

@ApiTags('Users & Profile')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current authenticated player full detailed profile',
    description:
      'Returns personal info, aggregated win/loss stats, ELO ratings, recent matches, and friendship counts.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile returned successfully',
    schema: {
      example: {
        success: true,
        code: 'profile_fetched',
        data: {
          user: {
            id: '6731d535-65cb-4935-842b-c2ddc5b7e7cf',
            username: 'bunny_player',
            displayName: 'Thỏ Hồng Đáng Yêu',
            email: 'player@bunny-cove.com',
            avatarUrl: 'https://res.cloudinary.com/.../avatar.webp',
            isEmailVerified: true,
            emailVerifiedAt: '2026-10-22T03:00:00.000Z',
            createdAt: '2026-10-22T02:00:00.000Z',
          },
          summary: {
            totalMatches: 24,
            totalWins: 18,
            totalLosses: 5,
            totalDraws: 1,
            winRate: 75,
            highestWinStreak: 6,
            totalPoints: 1250,
            friendsCount: 8,
          },
          stats: [
            {
              gameType: 'CARO',
              totalMatches: 14,
              wins: 11,
              losses: 3,
              draws: 0,
              winStreak: 4,
              points: 1320,
            },
            {
              gameType: 'BINGO',
              totalMatches: 10,
              wins: 7,
              losses: 2,
              draws: 1,
              winStreak: 2,
              points: 1180,
            },
          ],
          recentMatches: [],
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyProfile(@Req() request: Request) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const profile = await this.usersService.getMyProfile(userId);
    return {
      success: true,
      code: ResponseCodes.PROFILE_FETCHED,
      data: profile,
    };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update current player profile',
    description: 'Allows updating display name and/or custom username with uniqueness verification.',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Username already taken' })
  async updateProfile(
    @Req() request: Request,
    @Body() dto: UpdateProfileDto,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const updatedUser = await this.usersService.updateProfile(userId, dto);
    return {
      success: true,
      code: ResponseCodes.PROFILE_UPDATED,
      data: updatedUser,
    };
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get player game statistics and ranking breakdown',
  })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getMyStats(@Req() request: Request) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const stats = await this.usersService.getUserStats(userId);
    return {
      success: true,
      code: ResponseCodes.STATS_FETCHED,
      data: stats,
    };
  }

  @Get('me/matches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get paginated match history for current player',
  })
  @ApiResponse({ status: 200, description: 'Match history retrieved successfully' })
  async getMyMatches(
    @Req() request: Request,
    @Query() query: MatchHistoryQueryDto,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User identifier not found in session',
      });
    }

    const matchHistory = await this.usersService.getUserMatchHistory(userId, query);
    return {
      success: true,
      code: ResponseCodes.MATCH_HISTORY_FETCHED,
      data: matchHistory,
    };
  }

  @Get(':identifier')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get public player profile by user ID or username',
    description: 'Returns safe public profile info without exposing email or private tokens.',
  })
  @ApiParam({
    name: 'identifier',
    description: 'User UUID or username (e.g. bunny_player)',
    example: 'bunny_player',
  })
  @ApiResponse({ status: 200, description: 'Public profile found' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  async getPublicProfile(@Param('identifier') identifier: string) {
    const publicProfile = await this.usersService.getPublicProfile(identifier);
    return {
      success: true,
      code: ResponseCodes.PROFILE_FETCHED,
      data: publicProfile,
    };
  }
}
