// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Vietnamese (`vi`).
class AppLocalizationsVi extends AppLocalizations {
  AppLocalizationsVi([String locale = 'vi']) : super(locale);

  @override
  String get appName => 'Bunny Cove';

  @override
  String get welcomeTitle => 'Chào mừng đến Bunny Cove';

  @override
  String get welcomeSubtitle => 'Vũ trụ game ấm cúng của bạn';

  @override
  String get signIn => 'Đăng nhập';

  @override
  String get signUp => 'Đăng ký';

  @override
  String get email => 'Email';

  @override
  String get password => 'Mật khẩu';

  @override
  String get forgotPassword => 'Quên mật khẩu?';

  @override
  String get guestMode => 'Chơi thử nghiệm';

  @override
  String get errorOccurred => 'Đã xảy ra sự cố không mong muốn';

  @override
  String get retry => 'Thử lại';
}
