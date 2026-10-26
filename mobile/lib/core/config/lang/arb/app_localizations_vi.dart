import 'app_localizations.dart';

/// The translations for Vietnamese (`vi`).
class AppLocalizationsVi extends AppLocalizations {
  AppLocalizationsVi([String locale = 'vi']) : super(locale);

  @override
  String get appName => 'Bunny Cove';

  @override
  String get appTagline => 'Vũ Trụ Board Game Ấm Cúng';

  @override
  String get welcomeTitle => 'Chào mừng đến với Bunny Cove 🐰';

  @override
  String get welcomeSubtitle =>
      'Thư giãn, kết nối và so tài các mini-game ấm áp cùng bạn bè';

  @override
  String get commonOk => 'Đồng ý';

  @override
  String get commonCancel => 'Hủy';

  @override
  String get commonSave => 'Lưu';

  @override
  String get commonClose => 'Đóng';

  @override
  String get commonRetry => 'Thử lại';

  @override
  String get commonLoading => 'Đang tải...';

  @override
  String get commonError => 'Lỗi';

  @override
  String get commonSuccess => 'Thành công';

  @override
  String get commonWarning => 'Thông báo';

  @override
  String get commonBack => 'Quay lại';

  @override
  String get commonNext => 'Tiếp theo';

  @override
  String get commonConfirm => 'Xác nhận';

  @override
  String get commonCopied => 'Đã sao chép vào bộ nhớ tạm!';

  @override
  String noRouteDefined(String route) =>
      'Không tìm thấy tuyến đường cho $route';

  @override
  String get signInTitle => 'Đăng Nhập';

  @override
  String get signUpTitle => 'Tạo Hang Thỏ';

  @override
  String get emailLabel => 'Địa chỉ Email';

  @override
  String get passwordLabel => 'Mật khẩu';

  @override
  String get usernameLabel => 'Tên định danh (Bunny Tag)';

  @override
  String get displayNameLabel => 'Tên hiển thị';

  @override
  String get forgotPassword => 'Quên mật khẩu?';

  @override
  String get signOut => 'Đăng Xuất';

  @override
  String get dontHaveAccount => 'Chưa có hang thỏ? Tạo ngay';

  @override
  String get alreadyHaveAccount => 'Đã có hang thỏ? Đăng nhập';

  @override
  String welcomeBack(String name) => 'Mừng bạn trở lại, $name! 🍵';

  @override
  String get createRoom => 'Tạo Phòng Riêng';

  @override
  String get createRoomSubtitle => 'Mở phòng chơi ấm cúng và mời bạn bè';

  @override
  String get joinRoom => 'Vào Bằng Mã Phòng';

  @override
  String get joinRoomSubtitle => 'Nhập mã phòng 6 ký tự';

  @override
  String get quickMatch => 'Ghép Nhanh';

  @override
  String get quickMatchSubtitle => 'Chơi ngay cùng những người bạn ngẫu nhiên';

  @override
  String get activeGames => 'Kho Trò Chơi Mini';

  @override
  String get caroGameTitle => 'Cờ Caro Tatami';

  @override
  String get caroGameSubtitle => 'Bàn cờ 15x15 với Cà rốt 🥕 và Nơ hồng 🎀';

  @override
  String get bingoGameTitle => 'Bingo 5x5 Ấm Cúng';

  @override
  String get bingoGameSubtitle => 'Đóng dấu chân thỏ và ghép chữ B-I-N-G-O';

  @override
  String get roomTitle => 'Phòng Chơi';

  @override
  String roomCode(String code) => 'Mã phòng: $code';

  @override
  String get copyCode => 'Sao chép mã';

  @override
  String get waitingForPlayer => 'Đang chờ bạn bè tham gia...';

  @override
  String get ready => 'Sẵn sàng! 🐰';

  @override
  String get notReady => 'Chưa sẵn sàng';

  @override
  String get toggleReady => 'Bấm khi sẵn sàng';

  @override
  String get startGame => 'Bắt đầu ván đấu';

  @override
  String playerDisconnected(int seconds) =>
      'Đối phương tạm mất mạng! Chờ ${seconds}s...';

  @override
  String get playerReconnected => 'Đối phương đã quay lại phòng!';

  @override
  String get caroYourTurn => 'Lượt của bạn 🥕';

  @override
  String get caroOpponentTurn => 'Lượt của đối thủ 🎀';

  @override
  String caroTimeRemaining(int seconds) => 'Còn lại ${seconds}s';

  @override
  String get caroUndo => 'Xin đi lại';

  @override
  String get caroDraw => 'Cầu hòa';

  @override
  String get caroSurrender => 'Nhận thua';

  @override
  String get caroWin => 'Chiến Thắng! 🥕';

  @override
  String get caroDefeat => 'Trận Đấu Đẹp! 🎀';

  @override
  String get caroTie => 'Hòa Bình 🍵';

  @override
  String get bingoShuffle => 'Xáo Ngẫu Nhiên';

  @override
  String get bingoConfirm => 'Chốt Bàn Số';

  @override
  String get bingoYourTurn => 'Chọn 1 số!';

  @override
  String get bingoOpponentTurn => 'Đối thủ đang chọn...';

  @override
  String get bingoWin => 'Nhà Vô Địch BINGO! 🐰';

  @override
  String get languageLabel => 'Ngôn ngữ';

  @override
  String get languageEnglish => 'English';

  @override
  String get languageVietnamese => 'Tiếng Việt';

  @override
  String get connectionLostTitle => 'Mất Kết Nối';

  @override
  String get connectionLostContent =>
      'Đã mất kết nối tới máy chủ hang thỏ. Vui lòng kiểm tra lại mạng internet.';

  @override
  String translateResponseCode(String? code) {
    switch (code) {
      case 'success':
        return 'Thao tác thành công.';
      case 'server_error':
        return 'Máy chủ gặp sự cố ngoài ý muốn.';
      case 'validation_error':
        return 'Dữ liệu nhập vào chưa chính xác.';
      case 'not_found':
        return 'Không tìm thấy dữ liệu yêu cầu.';
      case 'unauthorized':
        return 'Vui lòng đăng nhập để tiếp tục.';
      case 'forbidden':
        return 'Bạn không có quyền thực hiện thao tác này.';
      case 'register_successful':
        return 'Tạo tài khoản thành công! Chào mừng tới Bunny Cove.';
      case 'login_successful':
        return 'Đăng nhập thành công! Chào mừng bạn trở lại.';
      case 'logout_successful':
        return 'Đã đăng xuất an toàn.';
      case 'token_refreshed':
        return 'Đã làm mới phiên đăng nhập.';
      case 'invalid_credentials':
        return 'Email hoặc mật khẩu không chính xác.';
      case 'email_already_exists':
        return 'Email này đã được sử dụng.';
      case 'username_already_exists':
        return 'Tên định danh này đã được sử dụng.';
      case 'user_not_found':
        return 'Không tìm thấy thông tin tài khoản.';
      case 'invalid_refresh_token':
        return 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';
      case 'access_denied':
        return 'Truy cập bị từ chối.';
      case 'verification_email_sent':
        return 'Mã xác thực 6 số đã được gửi qua email.';
      case 'email_verified_successful':
        return 'Xác thực email thành công!';
      case 'reset_password_email_sent':
        return 'Mã đặt lại mật khẩu đã được gửi qua email.';
      case 'password_reset_successful':
        return 'Mật khẩu đã được đặt lại thành công.';
      case 'invalid_otp':
        return 'Mã xác thực không đúng.';
      case 'otp_expired':
        return 'Mã xác thực đã hết hạn.';
      case 'room_created':
        return 'Tạo phòng chơi thành công!';
      case 'room_joined':
        return 'Đã tham gia phòng chơi!';
      case 'room_not_found':
        return 'Không tìm thấy phòng chơi.';
      case 'room_full':
        return 'Phòng chơi đã đủ người.';
      case 'not_your_turn':
        return 'Chưa tới lượt của bạn!';
      case 'invalid_move':
        return 'Nước đi không hợp lệ.';
      case 'caro_move_success':
        return 'Đã đặt quân cờ.';
      case 'caro_win':
        return 'Chiến thắng cờ Caro!';
      case 'bingo_win':
        return 'Chúc mừng! Bạn đã đạt BINGO!';
      default:
        return 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    }
  }
}
