// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'Bunny Cove';

  @override
  String get welcomeTitle => 'Welcome to Bunny Cove';

  @override
  String get welcomeSubtitle => 'Your cozy social gaming universe';

  @override
  String get signIn => 'Sign In';

  @override
  String get signUp => 'Sign Up';

  @override
  String get email => 'Email';

  @override
  String get password => 'Password';

  @override
  String get forgotPassword => 'Forgot Password?';

  @override
  String get guestMode => 'Continue as Guest';

  @override
  String get retry => 'Retry';

  @override
  String get errorOccurred => 'An unexpected error occurred';

  @override
  String get errorNetwork =>
      'Unable to connect to server. Please check your internet connection.';

  @override
  String get errorConnectionTimeout =>
      'Connection timed out. Please try again.';

  @override
  String get errorServer => 'Server error. Please try again later.';

  @override
  String get errorUnauthorized => 'Unauthorized access. Please sign in again.';

  @override
  String get errorForbidden =>
      'Access denied. You do not have permission for this action.';

  @override
  String get errorNotFound => 'The requested resource was not found.';

  @override
  String get errorValidationError =>
      'Validation failed. Please verify your input.';

  @override
  String get errorInvalidCredentials => 'Invalid email/username or password.';

  @override
  String get errorEmailAlreadyExists =>
      'An account with this email address already exists.';

  @override
  String get errorUsernameAlreadyExists =>
      'This username is already taken. Please choose another.';

  @override
  String get errorUserNotFound => 'User account not found.';

  @override
  String get errorInvalidRefreshToken =>
      'Session expired. Please sign in again.';

  @override
  String get errorAccessDenied => 'Access denied.';

  @override
  String get errorFriendRequestAlreadySent => 'Friend request already sent.';

  @override
  String get errorAlreadyFriends => 'You are already friends with this user.';

  @override
  String get errorCannotFriendSelf =>
      'You cannot send a friend request to yourself.';

  @override
  String get errorUserBlocked =>
      'Action not permitted because user is blocked.';

  @override
  String get errorInvalidOtp => 'Invalid OTP code. Please try again.';

  @override
  String get errorOtpExpired =>
      'OTP code has expired. Please request a new one.';

  @override
  String get errorOtpTooManyAttempts =>
      'Too many incorrect attempts. Please try again later.';

  @override
  String get errorEmailAlreadyVerified => 'Email address is already verified.';

  @override
  String get errorEmailNotVerified => 'Please verify your email address first.';

  @override
  String get errorCooldownActive =>
      'Please wait before requesting another code.';

  @override
  String get errorRoomNotFound => 'Room not found or no longer available.';

  @override
  String get errorRoomFull => 'Room is full.';

  @override
  String get errorRoomAlreadyIn => 'You are already inside this room.';

  @override
  String get errorGameNotStarted => 'Game has not started yet.';

  @override
  String get errorNotYourTurn => 'It is not your turn yet.';

  @override
  String get errorInvalidMove => 'Invalid move. Please try again.';

  @override
  String get errorBingoNumberAlreadyCalled =>
      'This number has already been called.';

  @override
  String get errorInvalidFileType =>
      'Invalid file format. Please upload JPG, PNG, or WebP.';

  @override
  String get errorFileTooLarge => 'File size exceeds the permitted limit.';

  @override
  String get errorNoFileProvided => 'No file was selected for upload.';
}
