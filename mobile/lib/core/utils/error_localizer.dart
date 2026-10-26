import 'package:flutter/widgets.dart';
import '../../common/constants/response_codes.constant.dart';
import '../config/lang/arb/app_localizations.dart';

extension ErrorLocalizationExtension on BuildContext {
  /// Resolves a standardized error code to its localized string based on the active locale.
  /// Falls back to [fallback] or the generic unexpected error message if the code is unrecognized.
  String getLocalizedError(String? code, {String? fallback}) {
    final l10n = AppLocalizations.of(this);
    if (l10n == null) return fallback ?? 'An unexpected error occurred';

    switch (code) {
      // General System & Network
      case ResponseCodesConstant.networkError:
        return l10n.errorNetwork;
      case ResponseCodesConstant.connectionTimeout:
        return l10n.errorConnectionTimeout;
      case ResponseCodesConstant.serverError:
        return l10n.errorServer;
      case ResponseCodesConstant.unauthorized:
        return l10n.errorUnauthorized;
      case ResponseCodesConstant.forbidden:
        return l10n.errorForbidden;
      case ResponseCodesConstant.notFound:
        return l10n.errorNotFound;
      case ResponseCodesConstant.validationError:
        return l10n.errorValidationError;

      // Authentication & User Management
      case ResponseCodesConstant.invalidCredentials:
        return l10n.errorInvalidCredentials;
      case ResponseCodesConstant.emailAlreadyExists:
        return l10n.errorEmailAlreadyExists;
      case ResponseCodesConstant.usernameAlreadyExists:
        return l10n.errorUsernameAlreadyExists;
      case ResponseCodesConstant.userNotFound:
        return l10n.errorUserNotFound;
      case ResponseCodesConstant.invalidRefreshToken:
        return l10n.errorInvalidRefreshToken;
      case ResponseCodesConstant.accessDenied:
        return l10n.errorAccessDenied;

      // Friends & Social
      case ResponseCodesConstant.friendRequestAlreadySent:
        return l10n.errorFriendRequestAlreadySent;
      case ResponseCodesConstant.alreadyFriends:
        return l10n.errorAlreadyFriends;
      case ResponseCodesConstant.cannotFriendSelf:
        return l10n.errorCannotFriendSelf;
      case ResponseCodesConstant.userBlocked:
        return l10n.errorUserBlocked;

      // Email & OTP
      case ResponseCodesConstant.invalidOtp:
        return l10n.errorInvalidOtp;
      case ResponseCodesConstant.otpExpired:
        return l10n.errorOtpExpired;
      case ResponseCodesConstant.otpTooManyAttempts:
        return l10n.errorOtpTooManyAttempts;
      case ResponseCodesConstant.emailAlreadyVerified:
        return l10n.errorEmailAlreadyVerified;
      case ResponseCodesConstant.emailNotVerified:
        return l10n.errorEmailNotVerified;
      case ResponseCodesConstant.cooldownActive:
        return l10n.errorCooldownActive;

      // Room & Games
      case ResponseCodesConstant.roomNotFound:
        return l10n.errorRoomNotFound;
      case ResponseCodesConstant.roomFull:
        return l10n.errorRoomFull;
      case ResponseCodesConstant.roomAlreadyIn:
        return l10n.errorRoomAlreadyIn;
      case ResponseCodesConstant.gameNotStarted:
        return l10n.errorGameNotStarted;
      case ResponseCodesConstant.notYourTurn:
        return l10n.errorNotYourTurn;
      case ResponseCodesConstant.invalidMove:
        return l10n.errorInvalidMove;
      case ResponseCodesConstant.bingoNumberAlreadyCalled:
        return l10n.errorBingoNumberAlreadyCalled;

      // Uploads & Media
      case ResponseCodesConstant.invalidFileType:
        return l10n.errorInvalidFileType;
      case ResponseCodesConstant.fileTooLarge:
        return l10n.errorFileTooLarge;
      case ResponseCodesConstant.noFileProvided:
        return l10n.errorNoFileProvided;

      default:
        return fallback ?? l10n.errorOccurred;
    }
  }
}
