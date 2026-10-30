/**
 * Application Default Assets and Media Paths
 * Follows Bunny Cove Project Rule: Zero hard-coded paths or URLs in services/controllers.
 * All default, fallback, mock, and CDN URLs must be declared here.
 */
import crypto from 'node:crypto';

export const AppDefaults = {
  // Auth defaults
  AUTH: {
    USERNAME_PREFIX: 'bunny_',
    generateUsername(): string {
      const randomHex = crypto.randomBytes(4).toString('hex');
      return `bunny_${randomHex}`;
    },
    // OTP Expiration: 2 minutes (120 seconds) per user specification
    OTP_TTL_SECONDS: 120,
    RESEND_COOLDOWN_SECONDS: 60,
    MAX_OTP_ATTEMPTS: 5,
    generateOtp(): string {
      return Math.floor(100000 + Math.random() * 900000).toString();
    },
  },

  // Email Configuration
  EMAIL: {
    DEFAULT_FROM: 'Bunny Cove <noreply@bunny-cove.com>',
    SUBJECT_VERIFY: '🐰 [Bunny Cove] Mã xác thực tài khoản của bạn',
    SUBJECT_RESET_PASSWORD: '🔐 [Bunny Cove] Yêu cầu đặt lại mật khẩu',
  },

  // Cloudinary storage folders
  CLOUDINARY: {
    AVATARS_FOLDER: 'bunny-cove/avatars',
    CHAT_FOLDER: 'bunny-cove/chat',
    STICKERS_FOLDER: 'bunny-cove/stickers',
    STICKERS_BASE_URL:
      'https://res.cloudinary.com/dcf2l7bst/image/upload/v1792641665/bunny-cove/stickers',
  },

  // Default avatar for new player registrations
  DEFAULT_AVATAR_URL:
    'https://res.cloudinary.com/dcf2l7bst/image/upload/v1792641665/bunny-cove/avatars/test_bunny_avatar.png',

  // Fallback dynamic avatar generator when Cloudinary is offline / unconfigured
  getFallbackAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(seed)}`;
  },

  // Fallback mock chat image when Cloudinary is offline / unconfigured
  FALLBACK_CHAT_IMAGE_URL:
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',

  // Swagger Documentation Examples
  SWAGGER: {
    EXAMPLE_AVATAR_URL:
      'https://res.cloudinary.com/dcf2l7bst/image/upload/v1792641665/bunny-cove/avatars/avatar_6731d535.webp',
  },
} as const;

export const DEFAULT_AVATAR_URL = AppDefaults.DEFAULT_AVATAR_URL;
