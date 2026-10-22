import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { ResendVerificationDto } from './dto/resend-verification.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';
import { AppDefaults } from '../../common/constants/defaults.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new player account' })
  @ApiResponse({
    status: 201,
    description: 'User account created successfully (returns user with auto-generated bunny_ username and default avatar)',
    schema: {
      example: {
        success: true,
        code: 'register_successful',
        data: {
          user: {
            id: '6731d535-65cb-4935-842b-c2ddc5b7e7cf',
            username: 'bunny_a8f3d10c',
            displayName: 'Thỏ Hồng',
            email: 'player@bunny.com',
            avatarUrl: AppDefaults.DEFAULT_AVATAR_URL,
          },
          accessToken: 'eyJhbGciOi...',
          refreshToken: 'eyJhbGciOi...',
          expiresIn: 900,
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'An account with this email already exists' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(dto);

    // Set Refresh Token in secure HTTP-only cookie (Web / iOS standard)
    response.cookie('refresh_token', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      code: ResponseCodes.REGISTER_SUCCESSFUL,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email/username and password' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully (returns user profile with current avatarUrl)',
    schema: {
      example: {
        success: true,
        code: 'login_successful',
        data: {
          user: {
            id: '6731d535-65cb-4935-842b-c2ddc5b7e7cf',
            username: 'bunny_player',
            displayName: 'Thỏ Hồng',
            email: 'player@bunny.com',
            avatarUrl: AppDefaults.SWAGGER.EXAMPLE_AVATAR_URL,
          },
          accessToken: 'eyJhbGciOi...',
          refreshToken: 'eyJhbGciOi...',
          expiresIn: 900,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(dto);

    // Set Refresh Token in secure HTTP-only cookie
    response.cookie('refresh_token', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      code: ResponseCodes.LOGIN_SUCCESSFUL,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
      },
    };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address with 6-digit OTP (valid for 2 minutes)' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    schema: {
      example: {
        success: true,
        code: 'email_verified_successful',
        message: 'Email verified successfully',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP, or email already verified' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification OTP (subject to 60-second cooldown)' })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent successfully',
    schema: {
      example: {
        success: true,
        code: 'verification_email_sent',
        message: 'Verification code sent to your email',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Cooldown active or email already verified' })
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP sent to registered email' })
  @ApiResponse({
    status: 200,
    description: 'Password reset OTP dispatched to user email',
    schema: {
      example: {
        success: true,
        code: 'reset_password_email_sent',
        message: 'Password reset OTP sent to your email',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Cooldown active or invalid email' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset account password using 6-digit OTP code' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully. Active sessions revoked.',
    schema: {
      example: {
        success: true,
        code: 'password_reset_successful',
        message: 'Password reset successfully. Please log in with your new password.',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP code' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access and refresh token pair' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @Req() request: Request,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Read from HTTP-only cookie or request body (for Flutter mobile client)
    const token = request.cookies?.refresh_token || dto?.refreshToken;
    const userId = (request.user as any)?.id || (request.body as any)?.userId;

    const tokens = await this.authService.refreshTokens(userId, token);

    // Update refresh token cookie
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      code: ResponseCodes.TOKEN_REFRESHED,
      data: tokens,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out current user and invalidate session' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = (request.user as any)?.id;
    if (userId) {
      await this.authService.logout(userId);
    }

    // Clear HTTP-only cookie
    response.clearCookie('refresh_token');

    return {
      success: true,
      code: ResponseCodes.LOGOUT_SUCCESSFUL,
      data: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile returned successfully with avatarUrl',
    schema: {
      example: {
        success: true,
        code: 'success',
        data: {
          id: '6731d535-65cb-4935-842b-c2ddc5b7e7cf',
          email: 'player@bunny.com',
          username: 'bunny_player',
          displayName: 'Thỏ Hồng',
          avatarUrl: AppDefaults.SWAGGER.EXAMPLE_AVATAR_URL,
          createdAt: '2026-10-22T03:00:00.000Z',
        },
      },
    },
  })
  getProfile(@Req() request: Request) {
    return {
      success: true,
      code: ResponseCodes.SUCCESS,
      data: request.user,
    };
  }
}
