/**
 * Standardized API and WebSocket Response Codes
 * Follows the Pawdar/Bunny Cove Project Rule specification.
 */
export const ResponseCodes = {
  // General Success & Errors
  SUCCESS: 'success',
  SERVER_ERROR: 'server_error',
  VALIDATION_ERROR: 'validation_error',
  NOT_FOUND: 'not_found',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',

  // Authentication & User Management Codes
  REGISTER_SUCCESSFUL: 'register_successful',
  LOGIN_SUCCESSFUL: 'login_successful',
  LOGOUT_SUCCESSFUL: 'logout_successful',
  TOKEN_REFRESHED: 'token_refreshed',
  INVALID_CREDENTIALS: 'invalid_credentials',
  EMAIL_ALREADY_EXISTS: 'email_already_exists',
  USERNAME_ALREADY_EXISTS: 'username_already_exists',
  USER_NOT_FOUND: 'user_not_found',
  INVALID_REFRESH_TOKEN: 'invalid_refresh_token',
  ACCESS_DENIED: 'access_denied',
  PROFILE_FETCHED: 'profile_fetched',
  PROFILE_UPDATED: 'profile_updated',
  STATS_FETCHED: 'stats_fetched',
  MATCH_HISTORY_FETCHED: 'match_history_fetched',

  // Friends & Social Codes
  FRIEND_REQUEST_SENT: 'friend_request_sent',
  FRIEND_REQUEST_ACCEPTED: 'friend_request_accepted',
  FRIEND_REQUEST_REJECTED: 'friend_request_rejected',
  FRIEND_REQUEST_CANCELLED: 'friend_request_cancelled',
  UNFRIENDED_SUCCESSFUL: 'unfriended_successful',
  FRIENDS_FETCHED: 'friends_fetched',
  FRIEND_REQUESTS_FETCHED: 'friend_requests_fetched',
  FRIENDSHIP_STATUS_FETCHED: 'friendship_status_fetched',
  ALREADY_FRIENDS: 'already_friends',
  FRIEND_REQUEST_ALREADY_SENT: 'friend_request_already_sent',
  FRIEND_REQUEST_NOT_FOUND: 'friend_request_not_found',
  CANNOT_FRIEND_SELF: 'cannot_friend_self',
  USER_BLOCKED: 'user_blocked',

  // Notifications & Push Codes
  NOTIFICATIONS_FETCHED: 'notifications_fetched',
  NOTIFICATION_READ: 'notification_read',
  ALL_NOTIFICATIONS_READ: 'all_notifications_read',
  NOTIFICATION_DELETED: 'notification_deleted',
  UNREAD_COUNT_FETCHED: 'unread_count_fetched',
  NOTIFICATION_NOT_FOUND: 'notification_not_found',
  FCM_TOKEN_UPDATED: 'fcm_token_updated',
  FCM_TOKEN_CLEARED: 'fcm_token_cleared',

  // Email & Password Reset Codes
  VERIFICATION_EMAIL_SENT: 'verification_email_sent',
  EMAIL_VERIFIED_SUCCESSFUL: 'email_verified_successful',
  RESET_PASSWORD_EMAIL_SENT: 'reset_password_email_sent',
  PASSWORD_RESET_SUCCESSFUL: 'password_reset_successful',
  INVALID_OTP: 'invalid_otp',
  OTP_EXPIRED: 'otp_expired',
  OTP_TOO_MANY_ATTEMPTS: 'otp_too_many_attempts',
  EMAIL_ALREADY_VERIFIED: 'email_already_verified',
  EMAIL_NOT_VERIFIED: 'email_not_verified',
  COOLDOWN_ACTIVE: 'cooldown_active',

  // Room Management Codes
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  ROOM_LEFT: 'room_left',
  ROOM_NOT_FOUND: 'room_not_found',
  ROOM_FULL: 'room_full',
  ROOM_ALREADY_IN: 'room_already_in',
  ROOM_PLAYER_READY: 'room_player_ready',
  ROOM_BOTH_READY: 'room_both_ready',
  ROOM_PLAYER_DISCONNECTED: 'room_player_disconnected',
  ROOM_PLAYER_RECONNECTED: 'room_player_reconnected',

  // Game Codes
  GAME_STARTED: 'game_started',
  GAME_NOT_STARTED: 'game_not_started',
  NOT_YOUR_TURN: 'not_your_turn',
  INVALID_MOVE: 'invalid_move',
  CARO_MOVE_SUCCESS: 'caro_move_success',
  CARO_WIN: 'caro_win',
  CARO_DRAW: 'caro_draw',
  BINGO_NUMBER_CALLED: 'bingo_number_called',
  BINGO_NUMBER_ALREADY_CALLED: 'bingo_number_already_called',
  BINGO_WIN: 'bingo_win',

  // Chat Codes
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_STICKER_SENT: 'chat_sticker_sent',
  CHAT_HISTORY_FETCHED: 'chat_history_fetched',
  STICKERS_FETCHED: 'stickers_fetched',
  INVALID_STICKER: 'invalid_sticker',
  CHAT_MESSAGE_EMPTY: 'chat_message_empty',
  CHAT_MESSAGE_EDITED: 'chat_message_edited',
  CHAT_MESSAGE_DELETED: 'chat_message_deleted',
  CHAT_MESSAGE_NOT_FOUND: 'chat_message_not_found',
  CHAT_CANNOT_EDIT_STICKER: 'chat_cannot_edit_sticker',
  CHAT_NOT_MESSAGE_OWNER: 'chat_not_message_owner',

  // Media & Upload Codes
  AVATAR_UPLOAD_SUCCESSFUL: 'avatar_upload_successful',
  IMAGE_UPLOAD_SUCCESSFUL: 'image_upload_successful',
  INVALID_FILE_TYPE: 'invalid_file_type',
  FILE_TOO_LARGE: 'file_too_large',
  NO_FILE_PROVIDED: 'no_file_provided',
} as const;

export type ResponseCode = (typeof ResponseCodes)[keyof typeof ResponseCodes];
