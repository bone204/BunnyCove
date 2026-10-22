import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 900 seconds (15 minutes)
}

export interface AuthResult {
  user: {
    id: string;
    username: string | null;
    displayName: string;
    email: string | null;
    avatarUrl: string | null;
  };
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret = process.env.JWT_SECRET || 'bunny_cove_super_secret_jwt_key';
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'bunny_cove_refresh_secret_jwt_key';

  // In-memory fallback map for environments where PostgreSQL isn't running yet
  private inMemoryUsers: Map<string, any> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existingUser = await this.findUserByIdentifier(dto.email);
    if (existingUser) {
      throw new ConflictException({
        code: ResponseCodes.EMAIL_ALREADY_EXISTS,
        message: 'An account with this email address already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    let createdUser: any;

    const defaultAvatar = 'https://res.cloudinary.com/dcf2l7bst/image/upload/v1792641665/bunny-cove/avatars/test_bunny_avatar.png';

    try {
      createdUser = await this.prisma.user.create({
        data: {
          username: dto.username.toLowerCase(),
          displayName: dto.displayName,
          email: dto.email.toLowerCase(),
          passwordHash,
          avatarUrl: defaultAvatar,
        },
      });
    } catch {
      // In-memory fallback
      createdUser = {
        id: `mock-uuid-${Date.now()}`,
        username: dto.username.toLowerCase(),
        displayName: dto.displayName,
        email: dto.email.toLowerCase(),
        passwordHash,
        avatarUrl: defaultAvatar,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryUsers.set(createdUser.id, createdUser);
    }

    const tokens = await this.generateTokens(createdUser.id, createdUser.email, createdUser.username);
    await this.updateRefreshTokenHash(createdUser.id, tokens.refreshToken);

    this.logger.log(`User registered: ${createdUser.email} (${createdUser.id})`);
    return {
      user: {
        id: createdUser.id,
        username: createdUser.username,
        displayName: createdUser.displayName,
        email: createdUser.email,
        avatarUrl: createdUser.avatarUrl,
      },
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.findUserByIdentifier(dto.identifier);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException({
        code: ResponseCodes.INVALID_CREDENTIALS,
        message: 'Invalid email/username or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: ResponseCodes.INVALID_CREDENTIALS,
        message: 'Invalid email/username or password',
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.username);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    this.logger.log(`User logged in: ${user.email} (${user.id})`);
    return {
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      tokens,
    };
  }

  async refreshTokens(userId: string | undefined, refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new BadRequestException({
        code: ResponseCodes.INVALID_REFRESH_TOKEN,
        message: 'Refresh token is required',
      });
    }

    let resolvedUserId = userId;
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.refreshSecret,
      });
      if (!resolvedUserId && payload?.sub) {
        resolvedUserId = payload.sub;
      }
    } catch {
      throw new UnauthorizedException({
        code: ResponseCodes.INVALID_REFRESH_TOKEN,
        message: 'Invalid or expired refresh token',
      });
    }

    if (!resolvedUserId) {
      throw new UnauthorizedException({
        code: ResponseCodes.ACCESS_DENIED,
        message: 'Could not determine user from refresh token',
      });
    }

    const user = await this.findUserById(resolvedUserId);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException({
        code: ResponseCodes.ACCESS_DENIED,
        message: 'Access denied: No active refresh session found',
      });
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException({
        code: ResponseCodes.INVALID_REFRESH_TOKEN,
        message: 'Invalid refresh token',
      });
    }

    // Generate new token pair (Token Rotation)
    const tokens = await this.generateTokens(user.id, user.email, user.username);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    this.logger.log(`Tokens refreshed for user: ${user.id}`);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { hashedRefreshToken: null },
      });
    } catch {
      const memUser = this.inMemoryUsers.get(userId);
      if (memUser) {
        memUser.hashedRefreshToken = null;
      }
    }

    this.logger.log(`User logged out: ${userId}`);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatarUrl },
      });
    } catch {
      const memUser = this.inMemoryUsers.get(userId);
      if (memUser) {
        memUser.avatarUrl = avatarUrl;
      }
    }

    this.logger.log(`Avatar updated for user: ${userId}`);
  }

  private async generateTokens(userId: string, email?: string, username?: string): Promise<AuthTokens> {
    const payload = { sub: userId, email, username };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes
    };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(refreshToken, salt);

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { hashedRefreshToken: hash },
      });
    } catch {
      const memUser = this.inMemoryUsers.get(userId);
      if (memUser) {
        memUser.hashedRefreshToken = hash;
      }
    }
  }

  private async findUserByIdentifier(identifier: string): Promise<any> {
    const cleanId = identifier.trim().toLowerCase();

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: cleanId }, { username: cleanId }],
        },
      });
      if (user) return user;
    } catch {
      // Fall through to in-memory check
    }

    return Array.from(this.inMemoryUsers.values()).find(
      (u) => u.email === cleanId || u.username === cleanId,
    );
  }

  private async findUserById(id: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (user) return user;
    } catch {
      // Fall through to in-memory check
    }

    return this.inMemoryUsers.get(id);
  }
}
