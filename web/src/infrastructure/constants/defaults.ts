/**
 * Centralized Default Constants & Storage Keys
 */
export const StorageKeys = {
  accessToken: 'bunny_cove_access_token',
  refreshToken: 'bunny_cove_refresh_token',
  userProfile: 'bunny_cove_user_profile',
  theme: 'bunny_cove_theme',
  locale: 'bunny_cove_locale',
} as const;

export const AppDefaults = {
  appName: 'Bunny Cove',
  defaultAvatarUrl:
    'https://res.cloudinary.com/dcf2l7bst/image/upload/v1792641665/bunny-cove/avatars/test_bunny_avatar.png',
  fallbackChatImageUrl:
    'https://res.cloudinary.com/dcf2l7bst/image/upload/v1792641665/bunny-cove/chat/fallback_image.png',
  defaultLocale: 'vi',
  supportedLocales: ['vi', 'en'] as const,
  turnTimeSeconds: 30,
  gracePeriodSeconds: 30,
} as const;
