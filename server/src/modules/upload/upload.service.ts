import 'multer';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'node:stream';
import { ResponseCodes } from '../../common/constants/response-codes.js';

export interface ChatImageUploadResult {
  imageUrl: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  private isCloudinaryConfigured(): boolean {
    return !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }

  async uploadAvatar(file: Express.Multer.File, userId: string): Promise<string> {
    this.validateImageFile(file, 5 * 1024 * 1024); // 5MB max

    if (!this.isCloudinaryConfigured()) {
      this.logger.warn(
        'Cloudinary credentials not configured in .env. Returning avatar fallback URL.',
      );
      return `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(userId)}`;
    }

    const result = await this.uploadToCloudinaryStream(file.buffer, {
      folder: 'bunny-cove/avatars',
      public_id: `avatar_${userId}`,
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'webp' },
      ],
    });

    this.logger.log(`Avatar uploaded to Cloudinary for user ${userId}: ${result.secure_url}`);
    return result.secure_url;
  }

  async uploadChatImage(
    file: Express.Multer.File,
    roomId: string,
    senderId: string,
  ): Promise<ChatImageUploadResult> {
    this.validateImageFile(file, 10 * 1024 * 1024); // 10MB max

    if (!this.isCloudinaryConfigured()) {
      this.logger.warn(
        'Cloudinary credentials not configured in .env. Returning chat image fallback.',
      );
      return {
        imageUrl: `https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80`,
        width: 800,
        height: 600,
        format: 'webp',
      };
    }

    const safeRoom = roomId.replace(/[^a-zA-Z0-9_-]/g, '');
    const cleanSender = senderId.substring(0, 8);
    const publicId = `chat_${Date.now()}_${cleanSender}`;

    const result = await this.uploadToCloudinaryStream(file.buffer, {
      folder: `bunny-cove/chat/${safeRoom}`,
      public_id: publicId,
      resource_type: 'image',
      transformation: [
        { width: 1200, crop: 'limit' },
        { quality: 'auto', fetch_format: 'webp' },
      ],
    });

    this.logger.log(`Chat image uploaded for room ${roomId}: ${result.secure_url}`);
    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  }

  private validateImageFile(file: Express.Multer.File, maxSizeBytes: number): void {
    if (!file) {
      throw new BadRequestException({
        code: ResponseCodes.NO_FILE_PROVIDED,
        message: 'No file uploaded',
      });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException({
        code: ResponseCodes.INVALID_FILE_TYPE,
        message: 'Only JPEG, PNG, WEBP, and GIF images are supported',
      });
    }

    if (file.size > maxSizeBytes) {
      throw new BadRequestException({
        code: ResponseCodes.FILE_TOO_LARGE,
        message: `File size exceeds the maximum limit of ${Math.round(maxSizeBytes / (1024 * 1024))}MB`,
      });
    }
  }

  private uploadToCloudinaryStream(
    buffer: Buffer,
    options: any,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error || !result) {
            this.logger.error(`Cloudinary upload failed: ${error?.message || 'Unknown error'}`);
            return reject(error || new Error('Cloudinary upload returned empty response'));
          }
          resolve(result);
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }
}
