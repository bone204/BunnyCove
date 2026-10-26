import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Centralized API and WebSocket endpoints for Bunny Cove.
abstract class ApiUrls {
  static String get baseURL =>
      dotenv.env['BASE_URL'] ?? 'http://localhost:3000/api';
  static String get socketURL =>
      dotenv.env['SOCKET_URL'] ?? 'http://localhost:3000';

  // Auth
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String refresh = '/auth/refresh';
  static const String logout = '/auth/logout';
  static const String verifyEmail = '/auth/verify-email';
  static const String resendVerification = '/auth/resend-verification';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';

  // Users
  static const String profileMe = '/users/me';
  static const String statsMe = '/users/me/stats';
  static const String matchesMe = '/users/me/matches';
  static const String userById = '/users';

  // Upload
  static const String uploadAvatar = '/upload/avatar';
  static const String uploadChatImage = '/upload/chat-image';
}
