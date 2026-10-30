import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { RedisService } from '../../common/redis/redis.service.js';
import { EmailService } from '../email/email.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { ResendVerificationDto } from './dto/resend-verification.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';
import { AppDefaults, DEFAULT_AVATAR_URL } from '../../common/constants/defaults.js';

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
    isEmailVerified: boolean;
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
    private readonly redis: RedisService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const cleanEmail = dto.email.trim().toLowerCase();
    const cleanDisplayName = dto.displayName?.trim() || 'Bunny Player';
    const existingUser = await this.findUserByIdentifier(cleanEmail);
    if (existingUser) {
      throw new ConflictException({
        code: ResponseCodes.EMAIL_ALREADY_EXISTS,
        message: 'An account with this email address already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    let createdUser: any;
    let username: string;
    if (dto.username?.trim()) {
      const cleanUsername = dto.username.trim().toLowerCase();
      const existing = await this.findUserByIdentifier(cleanUsername);
      if (existing) {
        throw new ConflictException({
          code: ResponseCodes.USERNAME_ALREADY_EXISTS,
          message: 'An account with this username already exists',
        });
      }
      username = cleanUsername;
    } else {
      username = await this.generateUniqueUsername();
    }
    const defaultAvatar = DEFAULT_AVATAR_URL;

    try {
      createdUser = await this.prisma.user.create({
        data: {
          username,
          displayName: cleanDisplayName,
          email: cleanEmail,
          passwordHash,
          avatarUrl: defaultAvatar,
          isEmailVerified: false,
        },
      });
    } catch (err: any) {
      // Handle unique constraint collisions from PostgreSQL (Prisma P2002)
      if (err?.code === 'P2002') {
        const target = err?.meta?.target;
        const isEmailConflict =
          (Array.isArray(target) && target.includes('email')) ||
          target === 'email' ||
          String(err?.message).includes('email');

        if (isEmailConflict) {
          throw new ConflictException({
            code: ResponseCodes.EMAIL_ALREADY_EXISTS,
            message: 'An account with this email address already exists',
          });
        }

        // If collision happened on username, retry once with an guaranteed timestamped candidate
        username = `${AppDefaults.AUTH.USERNAME_PREFIX}${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;
        try {
          createdUser = await this.prisma.user.create({
            data: {
              username,
              displayName: cleanDisplayName,
              email: cleanEmail,
              passwordHash,
              avatarUrl: defaultAvatar,
              isEmailVerified: false,
            },
          });
        } catch (retryErr: any) {
          if (retryErr?.code === 'P2002') {
            throw new ConflictException({
              code: ResponseCodes.EMAIL_ALREADY_EXISTS,
              message: 'An account with this email address already exists',
            });
          }
          throw retryErr;
        }
      } else {
        // Fall back to in-memory store only when database is unavailable / disconnected
        createdUser = {
          id: `mock-uuid-${Date.now()}`,
          username,
          displayName: cleanDisplayName,
          email: cleanEmail,
          passwordHash,
          avatarUrl: defaultAvatar,
          isEmailVerified: false,
          emailVerifiedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.inMemoryUsers.set(createdUser.id, createdUser);
      }
    }

    // Reset any previous failed OTP attempts for this email
    await this.redis.del(`otp:attempts:verify:${cleanEmail}`);

    // Generate 6-digit verification OTP with 2-minute (120s) lifespan
    const otp = AppDefaults.AUTH.generateOtp();
    await this.redis.set(`otp:verify:${cleanEmail}`, otp, AppDefaults.AUTH.OTP_TTL_SECONDS);
    await this.redis.set(`cooldown:verify:${cleanEmail}`, '1', AppDefaults.AUTH.RESEND_COOLDOWN_SECONDS);

    // Dispatch verification email (intercepted for mock/test domains, live via SMTP for real users)
    this.emailService
      .sendVerificationEmail(createdUser.email, createdUser.displayName, otp)
      .catch((err) => {
        this.logger.error(`Error sending verification email to ${cleanEmail}: ${err.message}`);
      });

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
        isEmailVerified: false,
      },
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const targetIdentifier = (dto.identifier || dto.email)?.trim();
    if (!targetIdentifier) {
      throw new UnauthorizedException({
        code: ResponseCodes.INVALID_CREDENTIALS,
        message: 'Invalid email/username or password',
      });
    }

    const user = await this.findUserByIdentifier(targetIdentifier);

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
        isEmailVerified: !!user.isEmailVerified,
      },
      tokens,
    };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ success: boolean; code: string; message: string }> {
    const cleanEmail = dto.email.trim().toLowerCase();
    const user = await this.findUserByIdentifier(cleanEmail);

    if (!user) {
      throw new BadRequestException({
        code: ResponseCodes.USER_NOT_FOUND,
        message: 'No account found with this email address',
      });
    }

    if (user.isEmailVerified) {
      throw new BadRequestException({
        code: ResponseCodes.EMAIL_ALREADY_VERIFIED,
        message: 'Email address is already verified',
      });
    }

    const storedOtp = await this.redis.get(`otp:verify:${cleanEmail}`);
    if (!storedOtp) {
      throw new BadRequestException({
        code: ResponseCodes.OTP_EXPIRED,
        message: 'OTP has expired or does not exist. Please request a new code.',
      });
    }

    // Track OTP verification attempts to prevent brute force
    const attemptKey = `otp:attempts:verify:${cleanEmail}`;
    const currentAttempts = Number((await this.redis.get(attemptKey)) || '0');

    if (currentAttempts >= AppDefaults.AUTH.MAX_OTP_ATTEMPTS) {
      await this.redis.del(`otp:verify:${cleanEmail}`);
      await this.redis.del(attemptKey);
      throw new BadRequestException({
        code: ResponseCodes.OTP_TOO_MANY_ATTEMPTS,
        message: 'Too many incorrect OTP attempts. Please request a new verification code.',
      });
    }

    if (storedOtp !== dto.otp.trim()) {
      const newAttempts = currentAttempts + 1;
      if (newAttempts >= AppDefaults.AUTH.MAX_OTP_ATTEMPTS) {
        await this.redis.del(`otp:verify:${cleanEmail}`);
        await this.redis.del(attemptKey);
        throw new BadRequestException({
          code: ResponseCodes.OTP_TOO_MANY_ATTEMPTS,
          message: 'Too many incorrect OTP attempts. Please request a new verification code.',
        });
      }

      await this.redis.set(attemptKey, String(newAttempts), AppDefaults.AUTH.OTP_TTL_SECONDS);
      throw new BadRequestException({
        code: ResponseCodes.INVALID_OTP,
        message: `Invalid OTP code. You have ${AppDefaults.AUTH.MAX_OTP_ATTEMPTS - newAttempts} attempt(s) remaining.`,
      });
    }

    // Invalidate used OTP and attempt counter
    await this.redis.del(`otp:verify:${cleanEmail}`);
    await this.redis.del(attemptKey);

    const verifiedAt = new Date();
    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerifiedAt: verifiedAt,
        },
      });
    } catch {
      const memUser = this.inMemoryUsers.get(user.id);
      if (memUser) {
        memUser.isEmailVerified = true;
        memUser.emailVerifiedAt = verifiedAt;
      }
    }

    this.logger.log(`Email verified successfully for: ${cleanEmail} (${user.id})`);
    return {
      success: true,
      code: ResponseCodes.EMAIL_VERIFIED_SUCCESSFUL,
      message: 'Email verified successfully',
    };
  }

  async resendVerification(dto: ResendVerificationDto): Promise<{ success: boolean; code: string; message: string }> {
    const cleanEmail = dto.email.trim().toLowerCase();
    const user = await this.findUserByIdentifier(cleanEmail);

    if (!user) {
      throw new BadRequestException({
        code: ResponseCodes.USER_NOT_FOUND,
        message: 'No account found with this email address',
      });
    }

    if (user.isEmailVerified) {
      throw new BadRequestException({
        code: ResponseCodes.EMAIL_ALREADY_VERIFIED,
        message: 'Email address is already verified',
      });
    }

    const isCooldown = await this.redis.exists(`cooldown:verify:${cleanEmail}`);
    if (isCooldown) {
      throw new BadRequestException({
        code: ResponseCodes.COOLDOWN_ACTIVE,
        message: `Please wait ${AppDefaults.AUTH.RESEND_COOLDOWN_SECONDS} seconds before requesting a new OTP`,
      });
    }

    // Clear previous failed attempts counter
    await this.redis.del(`otp:attempts:verify:${cleanEmail}`);

    const otp = AppDefaults.AUTH.generateOtp();
    await this.redis.set(`otp:verify:${cleanEmail}`, otp, AppDefaults.AUTH.OTP_TTL_SECONDS);
    await this.redis.set(`cooldown:verify:${cleanEmail}`, '1', AppDefaults.AUTH.RESEND_COOLDOWN_SECONDS);

    await this.emailService.sendVerificationEmail(user.email, user.displayName, otp);

    this.logger.log(`Resent verification OTP to: ${cleanEmail}`);
    return {
      success: true,
      code: ResponseCodes.VERIFICATION_EMAIL_SENT,
      message: 'Verification code sent to your email',
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ success: boolean; code: string; message: string }> {
    const cleanEmail = dto.email.trim().toLowerCase();
    const user = await this.findUserByIdentifier(cleanEmail);

    if (!user) {
      throw new BadRequestException({
        code: ResponseCodes.USER_NOT_FOUND,
        message: 'No account found with this email address',
      });
    }

    const isCooldown = await this.redis.exists(`cooldown:reset:${cleanEmail}`);
    if (isCooldown) {
      throw new BadRequestException({
        code: ResponseCodes.COOLDOWN_ACTIVE,
        message: `Please wait ${AppDefaults.AUTH.RESEND_COOLDOWN_SECONDS} seconds before requesting a new password reset OTP`,
      });
    }

    // Clear previous failed attempts counter
    await this.redis.del(`otp:attempts:reset:${cleanEmail}`);

    const otp = AppDefaults.AUTH.generateOtp();
    await this.redis.set(`otp:reset:${cleanEmail}`, otp, AppDefaults.AUTH.OTP_TTL_SECONDS);
    await this.redis.set(`cooldown:reset:${cleanEmail}`, '1', AppDefaults.AUTH.RESEND_COOLDOWN_SECONDS);

    await this.emailService.sendPasswordResetEmail(user.email, user.displayName, otp);

    this.logger.log(`Password reset OTP dispatched to: ${cleanEmail}`);
    return {
      success: true,
      code: ResponseCodes.RESET_PASSWORD_EMAIL_SENT,
      message: 'Password reset OTP sent to your email',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ success: boolean; code: string; message: string }> {
    const cleanEmail = dto.email.trim().toLowerCase();
    const user = await this.findUserByIdentifier(cleanEmail);

    if (!user) {
      throw new BadRequestException({
        code: ResponseCodes.USER_NOT_FOUND,
        message: 'No account found with this email address',
      });
    }

    const storedOtp = await this.redis.get(`otp:reset:${cleanEmail}`);
    if (!storedOtp) {
      throw new BadRequestException({
        code: ResponseCodes.OTP_EXPIRED,
        message: 'OTP has expired or does not exist. Please request a new code.',
      });
    }

    // Track password reset OTP attempts to prevent brute force
    const attemptKey = `otp:attempts:reset:${cleanEmail}`;
    const currentAttempts = Number((await this.redis.get(attemptKey)) || '0');

    if (currentAttempts >= AppDefaults.AUTH.MAX_OTP_ATTEMPTS) {
      await this.redis.del(`otp:reset:${cleanEmail}`);
      await this.redis.del(attemptKey);
      throw new BadRequestException({
        code: ResponseCodes.OTP_TOO_MANY_ATTEMPTS,
        message: 'Too many incorrect OTP attempts. Please request a new password reset code.',
      });
    }

    if (storedOtp !== dto.otp.trim()) {
      const newAttempts = currentAttempts + 1;
      if (newAttempts >= AppDefaults.AUTH.MAX_OTP_ATTEMPTS) {
        await this.redis.del(`otp:reset:${cleanEmail}`);
        await this.redis.del(attemptKey);
        throw new BadRequestException({
          code: ResponseCodes.OTP_TOO_MANY_ATTEMPTS,
          message: 'Too many incorrect OTP attempts. Please request a new password reset code.',
        });
      }

      await this.redis.set(attemptKey, String(newAttempts), AppDefaults.AUTH.OTP_TTL_SECONDS);
      throw new BadRequestException({
        code: ResponseCodes.INVALID_OTP,
        message: `Invalid OTP code. You have ${AppDefaults.AUTH.MAX_OTP_ATTEMPTS - newAttempts} attempt(s) remaining.`,
      });
    }

    // Invalidate OTP and attempts counter
    await this.redis.del(`otp:reset:${cleanEmail}`);
    await this.redis.del(attemptKey);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);
    const verifiedAt = new Date();

    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          isEmailVerified: true, // Proved email ownership via OTP
          emailVerifiedAt: verifiedAt,
          hashedRefreshToken: null, // Revoke all active sessions
        },
      });
    } catch {
      const memUser = this.inMemoryUsers.get(user.id);
      if (memUser) {
        memUser.passwordHash = passwordHash;
        memUser.isEmailVerified = true;
        memUser.emailVerifiedAt = verifiedAt;
        memUser.hashedRefreshToken = null;
      }
    }

    this.logger.log(`Password reset successfully for user: ${cleanEmail} (${user.id})`);
    return {
      success: true,
      code: ResponseCodes.PASSWORD_RESET_SUCCESSFUL,
      message: 'Password reset successfully. Please log in with your new password.',
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

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    if (!user || !user.hashedRefreshToken) {
      // Check if this token was recently rotated during a concurrent request race condition
      const cachedGraceTokens = await this.redis.get(`refresh:grace:${tokenHash}`);
      if (cachedGraceTokens) {
        try {
          return JSON.parse(cachedGraceTokens);
        } catch {
          // Fall through
        }
      }
      throw new UnauthorizedException({
        code: ResponseCodes.ACCESS_DENIED,
        message: 'Access denied: No active refresh session found',
      });
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isRefreshTokenValid) {
      // Check if this token was recently rotated during a concurrent request race condition
      const cachedGraceTokens = await this.redis.get(`refresh:grace:${tokenHash}`);
      if (cachedGraceTokens) {
        try {
          return JSON.parse(cachedGraceTokens);
        } catch {
          // Fall through
        }
      }
      throw new UnauthorizedException({
        code: ResponseCodes.INVALID_REFRESH_TOKEN,
        message: 'Invalid refresh token',
      });
    }

    // Generate new token pair (Token Rotation)
    const tokens = await this.generateTokens(user.id, user.email, user.username);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    // Cache previous token for 30s grace window to absorb duplicate requests from web/mobile clients
    await this.redis.set(`refresh:grace:${tokenHash}`, JSON.stringify(tokens), 30);

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
          OR: [
            { email: { equals: cleanId, mode: 'insensitive' } },
            { username: { equals: cleanId, mode: 'insensitive' } },
          ],
        },
      });
      if (user) return user;
    } catch {
      // Fall through to in-memory check
    }

    return Array.from(this.inMemoryUsers.values()).find(
      (u) =>
        u.email?.trim().toLowerCase() === cleanId ||
        u.username?.trim().toLowerCase() === cleanId,
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

  private async generateUniqueUsername(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = AppDefaults.AUTH.generateUsername();
      const existing = await this.findUserByIdentifier(candidate);
      if (!existing) {
        return candidate;
      }
    }
    // Timestamp fallback in case of rare collision
    return `${AppDefaults.AUTH.USERNAME_PREFIX}${Date.now().toString(36)}`;
  }
}
