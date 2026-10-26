import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_vi.dart';

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('vi'),
  ];

  // Core App
  String get appName;
  String get appTagline;
  String get welcomeTitle;
  String get welcomeSubtitle;

  // Common
  String get commonOk;
  String get commonCancel;
  String get commonSave;
  String get commonClose;
  String get commonRetry;
  String get commonLoading;
  String get commonError;
  String get commonSuccess;
  String get commonWarning;
  String get commonBack;
  String get commonNext;
  String get commonConfirm;
  String get commonCopied;
  String noRouteDefined(String route);

  // Auth
  String get signInTitle;
  String get signUpTitle;
  String get emailLabel;
  String get passwordLabel;
  String get usernameLabel;
  String get displayNameLabel;
  String get forgotPassword;
  String get signOut;
  String get dontHaveAccount;
  String get alreadyHaveAccount;

  // Home & Room
  String welcomeBack(String name);
  String get createRoom;
  String get createRoomSubtitle;
  String get joinRoom;
  String get joinRoomSubtitle;
  String get quickMatch;
  String get quickMatchSubtitle;
  String get activeGames;
  String get caroGameTitle;
  String get caroGameSubtitle;
  String get bingoGameTitle;
  String get bingoGameSubtitle;
  String get roomTitle;
  String roomCode(String code);
  String get copyCode;
  String get waitingForPlayer;
  String get ready;
  String get notReady;
  String get toggleReady;
  String get startGame;
  String playerDisconnected(int seconds);
  String get playerReconnected;

  // Games
  String get caroYourTurn;
  String get caroOpponentTurn;
  String caroTimeRemaining(int seconds);
  String get caroUndo;
  String get caroDraw;
  String get caroSurrender;
  String get caroWin;
  String get caroDefeat;
  String get caroTie;
  String get bingoShuffle;
  String get bingoConfirm;
  String get bingoYourTurn;
  String get bingoOpponentTurn;
  String get bingoWin;

  // Settings & Network
  String get languageLabel;
  String get languageEnglish;
  String get languageVietnamese;
  String get connectionLostTitle;
  String get connectionLostContent;

  // Dynamic Server Response Code Translation
  String translateResponseCode(String? code);
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
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'vi':
      return AppLocalizationsVi();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale".');
}
