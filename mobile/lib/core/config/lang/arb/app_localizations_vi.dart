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
  String get appTagline => 'Vũ trụ Game Ấm Cúng & Gắn Kết';

  @override
  String get welcomeTitle => 'Chào mừng đến Bunny Cove';

  @override
  String get welcomeSubtitle => 'Vũ trụ game ấm cúng của bạn';

  @override
  String get signIn => 'Đăng nhập';

  @override
  String get signUp => 'Đăng ký';

  @override
  String get signInDescription => 'Đăng nhập để bước vào vũ trụ ấm cúng';

  @override
  String get email => 'Email';

  @override
  String get emailHint => 'bunny@cove.test';

  @override
  String get password => 'Mật khẩu';

  @override
  String get forgotPassword => 'Quên mật khẩu?';

  @override
  String get guestMode => 'Chơi thử nghiệm';

  @override
  String get retry => 'Thử lại';

  @override
  String get pleaseEnterEmail => 'Vui lòng nhập địa chỉ email';

  @override
  String get pleaseEnterPassword => 'Vui lòng nhập mật khẩu';

  @override
  String welcomeBack(String displayName) {
    return 'Chào mừng bạn trở lại, $displayName! 🌸';
  }

  @override
  String get dialogOk => 'Đồng ý';

  @override
  String get dialogCancel => 'Hủy';

  @override
  String noRouteDefined(String routeName) {
    return 'Không tìm thấy tuyến đường $routeName';
  }

  @override
  String get errorOccurred => 'Đã xảy ra sự cố không mong muốn';

  @override
  String get errorNetwork =>
      'Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối mạng.';

  @override
  String get errorConnectionTimeout =>
      'Hết thời gian chờ kết nối. Vui lòng thử lại.';

  @override
  String get errorServer => 'Lỗi máy chủ. Vui lòng thử lại sau ít phút.';

  @override
  String get errorUnauthorized =>
      'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.';

  @override
  String get errorForbidden => 'Bạn không có quyền thực hiện thao tác này.';

  @override
  String get errorNotFound => 'Không tìm thấy tài nguyên yêu cầu.';

  @override
  String get errorValidationError =>
      'Dữ liệu nhập vào chưa hợp lệ. Vui lòng kiểm tra lại.';

  @override
  String get errorInvalidCredentials =>
      'Email/tên đăng nhập hoặc mật khẩu không chính xác.';

  @override
  String get errorEmailAlreadyExists =>
      'Địa chỉ email này đã được sử dụng bởi tài khoản khác.';

  @override
  String get errorUsernameAlreadyExists =>
      'Tên người dùng này đã tồn tại. Vui lòng chọn tên khác.';

  @override
  String get errorUserNotFound =>
      'Không tìm thấy thông tin tài khoản người dùng.';

  @override
  String get errorInvalidRefreshToken =>
      'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';

  @override
  String get errorAccessDenied => 'Truy cập bị từ chối.';

  @override
  String get errorFriendRequestAlreadySent =>
      'Lời mời kết bạn đã được gửi trước đó.';

  @override
  String get errorAlreadyFriends => 'Hai bạn đã là bạn bè của nhau.';

  @override
  String get errorCannotFriendSelf =>
      'Bạn không thể gửi lời mời kết bạn cho chính mình.';

  @override
  String get errorUserBlocked => 'Không thể thực hiện do tài khoản đã bị chặn.';

  @override
  String get errorInvalidOtp => 'Mã xác thực OTP không chính xác.';

  @override
  String get errorOtpExpired => 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.';

  @override
  String get errorOtpTooManyAttempts =>
      'Bạn đã nhập sai quá số lần quy định. Vui lòng thử lại sau.';

  @override
  String get errorEmailAlreadyVerified =>
      'Địa chỉ email này đã được xác thực trước đó.';

  @override
  String get errorEmailNotVerified =>
      'Vui lòng xác thực email trước khi tiếp tục.';

  @override
  String get errorCooldownActive =>
      'Vui lòng đợi thêm trước khi yêu cầu mã tiếp theo.';

  @override
  String get errorRoomNotFound => 'Phòng không tồn tại hoặc đã bị đóng.';

  @override
  String get errorRoomFull => 'Phòng chơi đã đủ người.';

  @override
  String get errorRoomAlreadyIn => 'Bạn hiện đã ở trong phòng này.';

  @override
  String get errorGameNotStarted => 'Trò chơi chưa được bắt đầu.';

  @override
  String get errorNotYourTurn => 'Chưa đến lượt đi của bạn.';

  @override
  String get errorInvalidMove => 'Nước đi không hợp lệ. Vui lòng thử lại.';

  @override
  String get errorBingoNumberAlreadyCalled => 'Số này đã được gọi trước đó.';

  @override
  String get errorInvalidFileType =>
      'Định dạng tệp không được hỗ trợ. Vui lòng chọn JPG, PNG hoặc WebP.';

  @override
  String get errorFileTooLarge =>
      'Kích thước tệp vượt quá dung lượng cho phép.';

  @override
  String get errorNoFileProvided => 'Chưa có tệp nào được chọn để tải lên.';

  @override
  String get errorInvalidSticker =>
      'Nhãn dán đã chọn không hợp lệ hoặc không khả dụng.';

  @override
  String get errorChatMessageEmpty => 'Nội dung tin nhắn không được để trống.';
}
