import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppUrlsConstant {
  static String get baseApiUrl => dotenv.env['BASE_URL'] ?? 'http://localhost:3000';
  static String get socketUrl => dotenv.env['SOCKET_URL'] ?? 'http://localhost:3000';

  // Auth Endpoints
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  static const String refresh = '/auth/refresh';
  static const String verifyEmail = '/auth/verify-email';
  static const String resendOtp = '/auth/resend-verification';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';

  // User Profile
  static const String userMe = '/users/me';
  static const String userStats = '/users/me/stats';
  static const String userMatches = '/users/me/matches';

  // Friends & Notifications
  static const String friends = '/friends';
  static const String notifications = '/notifications';
  static const String fcmToken = '/notifications/fcm-token';

  // Upload
  static const String uploadAvatar = '/upload/avatar';
  static const String uploadChatImage = '/upload/chat-image';
}
