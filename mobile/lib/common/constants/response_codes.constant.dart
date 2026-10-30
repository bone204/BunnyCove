class ResponseCodesConstant {
  // General Success & System Codes
  static const String success = 'success';
  static const String serverError = 'server_error';
  static const String validationError = 'validation_error';
  static const String notFound = 'not_found';
  static const String unauthorized = 'unauthorized';
  static const String forbidden = 'forbidden';

  // Client-Side Synthetic Error Codes
  static const String networkError = 'network_error';
  static const String connectionTimeout = 'connection_timeout';
  static const String unexpectedError = 'unexpected_error';

  // Authentication & User Management Codes
  static const String registerSuccessful = 'register_successful';
  static const String loginSuccessful = 'login_successful';
  static const String logoutSuccessful = 'logout_successful';
  static const String tokenRefreshed = 'token_refreshed';
  static const String invalidCredentials = 'invalid_credentials';
  static const String emailAlreadyExists = 'email_already_exists';
  static const String usernameAlreadyExists = 'username_already_exists';
  static const String userNotFound = 'user_not_found';
  static const String invalidRefreshToken = 'invalid_refresh_token';
  static const String accessDenied = 'access_denied';
  static const String profileFetched = 'profile_fetched';
  static const String profileUpdated = 'profile_updated';
  static const String statsFetched = 'stats_fetched';
  static const String matchHistoryFetched = 'match_history_fetched';

  // Friends & Social Codes
  static const String friendRequestSent = 'friend_request_sent';
  static const String friendRequestAccepted = 'friend_request_accepted';
  static const String friendRequestRejected = 'friend_request_rejected';
  static const String friendRequestCancelled = 'friend_request_cancelled';
  static const String unfriendedSuccessful = 'unfriended_successful';
  static const String friendsFetched = 'friends_fetched';
  static const String friendRequestsFetched = 'friend_requests_fetched';
  static const String friendshipStatusFetched = 'friendship_status_fetched';
  static const String alreadyFriends = 'already_friends';
  static const String friendRequestAlreadySent = 'friend_request_already_sent';
  static const String friendRequestNotFound = 'friend_request_not_found';
  static const String cannotFriendSelf = 'cannot_friend_self';
  static const String userBlocked = 'user_blocked';

  // Notifications & Push Codes
  static const String notificationsFetched = 'notifications_fetched';
  static const String notificationRead = 'notification_read';
  static const String allNotificationsRead = 'all_notifications_read';
  static const String notificationDeleted = 'notification_deleted';
  static const String unreadCountFetched = 'unread_count_fetched';
  static const String notificationNotFound = 'notification_not_found';
  static const String fcmTokenUpdated = 'fcm_token_updated';
  static const String fcmTokenCleared = 'fcm_token_cleared';

  // Email & Password Reset Codes
  static const String verificationEmailSent = 'verification_email_sent';
  static const String emailVerifiedSuccessful = 'email_verified_successful';
  static const String resetPasswordEmailSent = 'reset_password_email_sent';
  static const String passwordResetSuccessful = 'password_reset_successful';
  static const String invalidOtp = 'invalid_otp';
  static const String otpExpired = 'otp_expired';
  static const String otpTooManyAttempts = 'otp_too_many_attempts';
  static const String emailAlreadyVerified = 'email_already_verified';
  static const String emailNotVerified = 'email_not_verified';
  static const String cooldownActive = 'cooldown_active';

  // Room Management Codes
  static const String roomCreated = 'room_created';
  static const String roomJoined = 'room_joined';
  static const String roomLeft = 'room_left';
  static const String roomNotFound = 'room_not_found';
  static const String roomFull = 'room_full';
  static const String roomAlreadyIn = 'room_already_in';
  static const String roomPlayerReady = 'room_player_ready';
  static const String roomBothReady = 'room_both_ready';
  static const String roomPlayerDisconnected = 'room_player_disconnected';
  static const String roomPlayerReconnected = 'room_player_reconnected';

  // Game Codes
  static const String gameStarted = 'game_started';
  static const String gameNotStarted = 'game_not_started';
  static const String notYourTurn = 'not_your_turn';
  static const String invalidMove = 'invalid_move';
  static const String caroMoveSuccess = 'caro_move_success';
  static const String caroWin = 'caro_win';
  static const String caroDraw = 'caro_draw';
  static const String bingoNumberCalled = 'bingo_number_called';
  static const String bingoNumberAlreadyCalled = 'bingo_number_already_called';
  static const String bingoWin = 'bingo_win';

  // Chat Codes
  static const String chatMessageSent = 'chat_message_sent';
  static const String chatStickerSent = 'chat_sticker_sent';
  static const String chatHistoryFetched = 'chat_history_fetched';
  static const String stickersFetched = 'stickers_fetched';
  static const String invalidSticker = 'invalid_sticker';
  static const String chatMessageEmpty = 'chat_message_empty';

  // Media & Upload Codes
  static const String avatarUploadSuccessful = 'avatar_upload_successful';
  static const String imageUploadSuccessful = 'image_upload_successful';
  static const String invalidFileType = 'invalid_file_type';
  static const String fileTooLarge = 'file_too_large';
  static const String noFileProvided = 'no_file_provided';
}
