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
  USER_NOT_FOUND: 'user_not_found',
  INVALID_REFRESH_TOKEN: 'invalid_refresh_token',
  ACCESS_DENIED: 'access_denied',

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
} as const;

export type ResponseCode = (typeof ResponseCodes)[keyof typeof ResponseCodes];
