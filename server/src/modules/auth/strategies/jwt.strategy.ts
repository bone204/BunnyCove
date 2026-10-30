import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { DEFAULT_AVATAR_URL } from '../../../common/constants/defaults.js';
import { ResponseCodes } from '../../../common/constants/response-codes.js';

export interface JwtPayload {
  sub: string;
  email?: string;
  username?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'bunny_cove_super_secret_jwt_key',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          isEmailVerified: true,
          emailVerifiedAt: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException({
          code: ResponseCodes.USER_NOT_FOUND,
          message: 'User account no longer exists',
        });
      }

      return user;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      // Fallback for in-memory / testing without running database
      return {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
        displayName: payload.username || 'Bunny Player',
        avatarUrl: DEFAULT_AVATAR_URL,
        isEmailVerified: false,
        emailVerifiedAt: null,
      };
    }
  }
}
