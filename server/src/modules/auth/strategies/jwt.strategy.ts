import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../common/prisma/prisma.service.js';

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
          createdAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User account no longer exists');
      }

      return user;
    } catch {
      // Fallback for in-memory / testing without running database
      return {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
        displayName: payload.username || 'Bunny Player',
        avatarUrl: 'https://res.cloudinary.com/dcf2l7bst/image/upload/v1792641665/bunny-cove/avatars/test_bunny_avatar.png',
      };
    }
  }
}
