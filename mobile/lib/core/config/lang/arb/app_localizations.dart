import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_vi.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'arb/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('vi')
  ];

  /// No description provided for @appName.
  ///
  /// In en, this message translates to:
  /// **'Bunny Cove'**
  String get appName;

  /// No description provided for @appTagline.
  ///
  /// In en, this message translates to:
  /// **'Cozy Social Gaming Universe'**
  String get appTagline;

  /// No description provided for @welcomeTitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome to Bunny Cove'**
  String get welcomeTitle;

  /// No description provided for @welcomeSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Your cozy social gaming universe'**
  String get welcomeSubtitle;

  /// No description provided for @signIn.
  ///
  /// In en, this message translates to:
  /// **'Sign In'**
  String get signIn;

  /// No description provided for @signUp.
  ///
  /// In en, this message translates to:
  /// **'Sign Up'**
  String get signUp;

  /// No description provided for @signInDescription.
  ///
  /// In en, this message translates to:
  /// **'Sign in to enter your cozy universe'**
  String get signInDescription;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @emailHint.
  ///
  /// In en, this message translates to:
  /// **'bunny@cove.test'**
  String get emailHint;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @forgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password?'**
  String get forgotPassword;

  /// No description provided for @guestMode.
  ///
  /// In en, this message translates to:
  /// **'Continue as Guest'**
  String get guestMode;

  /// No description provided for @retry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// No description provided for @pleaseEnterEmail.
  ///
  /// In en, this message translates to:
  /// **'Please enter your email'**
  String get pleaseEnterEmail;

  /// No description provided for @pleaseEnterPassword.
  ///
  /// In en, this message translates to:
  /// **'Please enter your password'**
  String get pleaseEnterPassword;

  /// Greeting displayed when user signs in successfully
  ///
  /// In en, this message translates to:
  /// **'Welcome back, {displayName}! 🌸'**
  String welcomeBack(String displayName);

  /// No description provided for @dialogOk.
  ///
  /// In en, this message translates to:
  /// **'OK'**
  String get dialogOk;

  /// No description provided for @dialogCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get dialogCancel;

  /// Error text when an unknown route is accessed
  ///
  /// In en, this message translates to:
  /// **'No route defined for {routeName}'**
  String noRouteDefined(String routeName);

  /// No description provided for @errorOccurred.
  ///
  /// In en, this message translates to:
  /// **'An unexpected error occurred'**
  String get errorOccurred;

  /// No description provided for @errorNetwork.
  ///
  /// In en, this message translates to:
  /// **'Unable to connect to server. Please check your internet connection.'**
  String get errorNetwork;

  /// No description provided for @errorConnectionTimeout.
  ///
  /// In en, this message translates to:
  /// **'Connection timed out. Please try again.'**
  String get errorConnectionTimeout;

  /// No description provided for @errorServer.
  ///
  /// In en, this message translates to:
  /// **'Server error. Please try again later.'**
  String get errorServer;

  /// No description provided for @errorUnauthorized.
  ///
  /// In en, this message translates to:
  /// **'Unauthorized access. Please sign in again.'**
  String get errorUnauthorized;

  /// No description provided for @errorForbidden.
  ///
  /// In en, this message translates to:
  /// **'Access denied. You do not have permission for this action.'**
  String get errorForbidden;

  /// No description provided for @errorNotFound.
  ///
  /// In en, this message translates to:
  /// **'The requested resource was not found.'**
  String get errorNotFound;

  /// No description provided for @errorValidationError.
  ///
  /// In en, this message translates to:
  /// **'Validation failed. Please verify your input.'**
  String get errorValidationError;

  /// No description provided for @errorInvalidCredentials.
  ///
  /// In en, this message translates to:
  /// **'Invalid email/username or password.'**
  String get errorInvalidCredentials;

  /// No description provided for @errorEmailAlreadyExists.
  ///
  /// In en, this message translates to:
  /// **'An account with this email address already exists.'**
  String get errorEmailAlreadyExists;

  /// No description provided for @errorUsernameAlreadyExists.
  ///
  /// In en, this message translates to:
  /// **'This username is already taken. Please choose another.'**
  String get errorUsernameAlreadyExists;

  /// No description provided for @errorUserNotFound.
  ///
  /// In en, this message translates to:
  /// **'User account not found.'**
  String get errorUserNotFound;

  /// No description provided for @errorInvalidRefreshToken.
  ///
  /// In en, this message translates to:
  /// **'Session expired. Please sign in again.'**
  String get errorInvalidRefreshToken;

  /// No description provided for @errorAccessDenied.
  ///
  /// In en, this message translates to:
  /// **'Access denied.'**
  String get errorAccessDenied;

  /// No description provided for @errorFriendRequestAlreadySent.
  ///
  /// In en, this message translates to:
  /// **'Friend request already sent.'**
  String get errorFriendRequestAlreadySent;

  /// No description provided for @errorAlreadyFriends.
  ///
  /// In en, this message translates to:
  /// **'You are already friends with this user.'**
  String get errorAlreadyFriends;

  /// No description provided for @errorCannotFriendSelf.
  ///
  /// In en, this message translates to:
  /// **'You cannot send a friend request to yourself.'**
  String get errorCannotFriendSelf;

  /// No description provided for @errorUserBlocked.
  ///
  /// In en, this message translates to:
  /// **'Action not permitted because user is blocked.'**
  String get errorUserBlocked;

  /// No description provided for @errorInvalidOtp.
  ///
  /// In en, this message translates to:
  /// **'Invalid OTP code. Please try again.'**
  String get errorInvalidOtp;

  /// No description provided for @errorOtpExpired.
  ///
  /// In en, this message translates to:
  /// **'OTP code has expired. Please request a new one.'**
  String get errorOtpExpired;

  /// No description provided for @errorOtpTooManyAttempts.
  ///
  /// In en, this message translates to:
  /// **'Too many incorrect attempts. Please try again later.'**
  String get errorOtpTooManyAttempts;

  /// No description provided for @errorEmailAlreadyVerified.
  ///
  /// In en, this message translates to:
  /// **'Email address is already verified.'**
  String get errorEmailAlreadyVerified;

  /// No description provided for @errorEmailNotVerified.
  ///
  /// In en, this message translates to:
  /// **'Please verify your email address first.'**
  String get errorEmailNotVerified;

  /// No description provided for @errorCooldownActive.
  ///
  /// In en, this message translates to:
  /// **'Please wait before requesting another code.'**
  String get errorCooldownActive;

  /// No description provided for @errorRoomNotFound.
  ///
  /// In en, this message translates to:
  /// **'Room not found or no longer available.'**
  String get errorRoomNotFound;

  /// No description provided for @errorRoomFull.
  ///
  /// In en, this message translates to:
  /// **'Room is full.'**
  String get errorRoomFull;

  /// No description provided for @errorRoomAlreadyIn.
  ///
  /// In en, this message translates to:
  /// **'You are already inside this room.'**
  String get errorRoomAlreadyIn;

  /// No description provided for @errorGameNotStarted.
  ///
  /// In en, this message translates to:
  /// **'Game has not started yet.'**
  String get errorGameNotStarted;

  /// No description provided for @errorNotYourTurn.
  ///
  /// In en, this message translates to:
  /// **'It is not your turn yet.'**
  String get errorNotYourTurn;

  /// No description provided for @errorInvalidMove.
  ///
  /// In en, this message translates to:
  /// **'Invalid move. Please try again.'**
  String get errorInvalidMove;

  /// No description provided for @errorBingoNumberAlreadyCalled.
  ///
  /// In en, this message translates to:
  /// **'This number has already been called.'**
  String get errorBingoNumberAlreadyCalled;

  /// No description provided for @errorInvalidFileType.
  ///
  /// In en, this message translates to:
  /// **'Invalid file format. Please upload JPG, PNG, or WebP.'**
  String get errorInvalidFileType;

  /// No description provided for @errorFileTooLarge.
  ///
  /// In en, this message translates to:
  /// **'File size exceeds the permitted limit.'**
  String get errorFileTooLarge;

  /// No description provided for @errorNoFileProvided.
  ///
  /// In en, this message translates to:
  /// **'No file was selected for upload.'**
  String get errorNoFileProvided;

  /// No description provided for @errorInvalidSticker.
  ///
  /// In en, this message translates to:
  /// **'The selected sticker is invalid or unavailable.'**
  String get errorInvalidSticker;

  /// No description provided for @errorChatMessageEmpty.
  ///
  /// In en, this message translates to:
  /// **'Chat message cannot be empty.'**
  String get errorChatMessageEmpty;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'vi'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'vi':
      return AppLocalizationsVi();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
