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
  String get errorOccurred => 'An unexpected error occurred';

  @override
  String get retry => 'Retry';
}
