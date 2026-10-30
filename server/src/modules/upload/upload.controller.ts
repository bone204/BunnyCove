import 'multer';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Body,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { UploadService } from './upload.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { ResponseCodes } from '../../common/constants/response-codes.js';

@ApiTags('Upload & Media')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload and update user profile avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (JPEG, PNG, WEBP, GIF, max 5MB)',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 200, description: 'Avatar uploaded and profile updated' })
  @ApiResponse({ status: 400, description: 'Invalid file format or size' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const userId = (request.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'User not authenticated',
      });
    }

    const avatarUrl = await this.uploadService.uploadAvatar(file, userId);

    // Persist new avatar URL to database
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatarUrl },
      });
    } catch {
      // In-memory or fallback mode
    }

    return {
      success: true,
      code: ResponseCodes.AVATAR_UPLOAD_SUCCESSFUL,
      data: {
        avatarUrl,
        userId,
      },
    };
  }

  @Post('chat-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload an image for in-room real-time chat' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Chat image file (JPEG, PNG, WEBP, GIF, max 10MB)',
        },
        roomId: {
          type: 'string',
          description: 'Unique room code or ID where image is sent',
          example: 'BUNNY-92',
        },
      },
      required: ['file', 'roomId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Chat image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format or missing room ID' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadChatImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('roomId') roomId: string,
    @Req() request: Request,
  ) {
    const userId = (request.user as any)?.id;
    if (!roomId) {
      throw new BadRequestException({
        code: ResponseCodes.VALIDATION_ERROR,
        message: 'roomId is required for chat images',
      });
    }

    const result = await this.uploadService.uploadChatImage(
      file,
      roomId,
      userId || 'guest',
    );

    return {
      success: true,
      code: ResponseCodes.IMAGE_UPLOAD_SUCCESSFUL,
      data: result,
    };
  }
}
