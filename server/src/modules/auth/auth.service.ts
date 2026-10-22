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

    const username = await this.generateUniqueUsername();
    const defaultAvatar = DEFAULT_AVATAR_URL;

    try {
      createdUser = await this.prisma.user.create({
        data: {
          username,
          displayName: dto.displayName,
          email: cleanEmail,
          passwordHash,
          avatarUrl: defaultAvatar,
          isEmailVerified: false,
        },
      });
    } catch {
      // In-memory fallback
      createdUser = {
        id: `mock-uuid-${Date.now()}`,
        username,
        displayName: dto.displayName,
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

    // Generate 6-digit verification OTP with 2-minute (120s) lifespan
    const otp = AppDefaults.AUTH.generateOtp();
    await this.redis.set(`otp:verify:${cleanEmail}`, otp, AppDefaults.AUTH.OTP_TTL_SECONDS);
    await this.redis.set(`cooldown:verify:${cleanEmail}`, '1', AppDefaults.AUTH.RESEND_COOLDOWN_SECONDS);

    // Dispatch verification email (console fallback or Gmail SMTP)
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

    if (storedOtp !== dto.otp.trim()) {
      throw new BadRequestException({
        code: ResponseCodes.INVALID_OTP,
        message: 'Invalid OTP code',
      });
    }

    // Invalidate used OTP
    await this.redis.del(`otp:verify:${cleanEmail}`);

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

    if (storedOtp !== dto.otp.trim()) {
      throw new BadRequestException({
        code: ResponseCodes.INVALID_OTP,
        message: 'Invalid OTP code',
      });
    }

    // Invalidate OTP
    await this.redis.del(`otp:reset:${cleanEmail}`);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);

    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          hashedRefreshToken: null, // Revoke all active sessions
        },
      });
    } catch {
      const memUser = this.inMemoryUsers.get(user.id);
      if (memUser) {
        memUser.passwordHash = passwordHash;
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
