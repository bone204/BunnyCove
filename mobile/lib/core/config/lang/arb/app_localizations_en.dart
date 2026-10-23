import 'app_localizations.dart';

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'Bunny Cove';

  @override
  String get appTagline => 'Cozy Social Gaming Universe';

  @override
  String get welcomeTitle => 'Welcome to Bunny Cove 🐰';

  @override
  String get welcomeSubtitle =>
      'Relax, connect, and enjoy cozy mini-games with friends';

  @override
  String get commonOk => 'OK';

  @override
  String get commonCancel => 'Cancel';

  @override
  String get commonSave => 'Save';

  @override
  String get commonClose => 'Close';

  @override
  String get commonRetry => 'Try Again';

  @override
  String get commonLoading => 'Loading...';

  @override
  String get commonError => 'Error';

  @override
  String get commonSuccess => 'Success';

  @override
  String get commonWarning => 'Notice';

  @override
  String get commonBack => 'Back';

  @override
  String get commonNext => 'Next';

  @override
  String get commonConfirm => 'Confirm';

  @override
  String get commonCopied => 'Copied to clipboard!';

  @override
  String noRouteDefined(String route) => 'No route defined for $route';

  @override
  String get signInTitle => 'Sign In';

  @override
  String get signUpTitle => 'Create Burrow';

  @override
  String get emailLabel => 'Email Address';

  @override
  String get passwordLabel => 'Password';

  @override
  String get usernameLabel => 'Bunny Tag (Username)';

  @override
  String get displayNameLabel => 'Display Name';

  @override
  String get forgotPassword => 'Forgot Password?';

  @override
  String get signOut => 'Sign Out';

  @override
  String get dontHaveAccount => 'New to Bunny Cove? Create your burrow';

  @override
  String get alreadyHaveAccount => 'Already have a burrow? Sign in';

  @override
  String welcomeBack(String name) => 'Welcome back, $name! 🍵';

  @override
  String get createRoom => 'Create Private Burrow';

  @override
  String get createRoomSubtitle => 'Start a cozy room and invite a friend';

  @override
  String get joinRoom => 'Join with Code';

  @override
  String get joinRoomSubtitle => 'Enter a 6-character room code';

  @override
  String get quickMatch => 'Quick Matchmaking';

  @override
  String get quickMatchSubtitle => 'Play instantly with a fellow cozy wanderer';

  @override
  String get activeGames => 'Cozy Game Collection';

  @override
  String get caroGameTitle => 'Tatami Gomoku';

  @override
  String get caroGameSubtitle => '15x15 Caro with Carrot 🥕 & Ribbon 🎀';

  @override
  String get bingoGameTitle => 'Cozy Bingo 5x5';

  @override
  String get bingoGameSubtitle => 'Stamp bunny paws & spell B-I-N-G-O';

  @override
  String get roomTitle => 'Burrow Room';

  @override
  String roomCode(String code) => 'Room Code: $code';

  @override
  String get copyCode => 'Copy Code';

  @override
  String get waitingForPlayer => 'Waiting for a friend to hop in...';

  @override
  String get ready => 'Ready! 🐰';

  @override
  String get notReady => 'Waiting';

  @override
  String get toggleReady => 'Tap when Ready';

  @override
  String get startGame => 'Start Match';

  @override
  String playerDisconnected(int seconds) =>
      'Opponent disconnected! Waiting ${seconds}s...';

  @override
  String get playerReconnected => 'Opponent hopped back in!';

  @override
  String get caroYourTurn => 'Your Turn 🥕';

  @override
  String get caroOpponentTurn => 'Friend\'s Turn 🎀';

  @override
  String caroTimeRemaining(int seconds) => '${seconds}s remaining';

  @override
  String get caroUndo => 'Request Undo';

  @override
  String get caroDraw => 'Offer Draw';

  @override
  String get caroSurrender => 'Friendly Resign';

  @override
  String get caroWin => 'Victory! 🥕';

  @override
  String get caroDefeat => 'Well Played! 🎀';

  @override
  String get caroTie => 'Peaceful Draw 🍵';

  @override
  String get bingoShuffle => 'Shuffle Tiles';

  @override
  String get bingoConfirm => 'Confirm Board';

  @override
  String get bingoYourTurn => 'Call a number!';

  @override
  String get bingoOpponentTurn => 'Friend is choosing...';

  @override
  String get bingoWin => 'BINGO Champion! 🐰';

  @override
  String get languageLabel => 'Language';

  @override
  String get languageEnglish => 'English';

  @override
  String get languageVietnamese => 'Tiếng Việt';

  @override
  String get connectionLostTitle => 'Connection Interrupted';

  @override
  String get connectionLostContent =>
      'Lost touch with the burrow server. Please check your internet connection.';

  @override
  String translateResponseCode(String? code) {
    switch (code) {
      case 'success':
        return 'Action completed successfully.';
      case 'server_error':
        return 'An unexpected glitch occurred in the burrow.';
      case 'validation_error':
        return 'Please double-check your details.';
      case 'not_found':
        return 'Requested item was not found.';
      case 'unauthorized':
        return 'Please sign in to proceed.';
      case 'forbidden':
        return 'Access is forbidden.';
      case 'register_successful':
        return 'Burrow created! Welcome to Bunny Cove.';
      case 'login_successful':
        return 'Welcome back to your burrow!';
      case 'logout_successful':
        return 'Signed out safely.';
      case 'token_refreshed':
        return 'Session refreshed.';
      case 'invalid_credentials':
        return 'Incorrect email or password.';
      case 'email_already_exists':
        return 'This email is already registered.';
      case 'username_already_exists':
        return 'This bunny tag is already taken.';
      case 'user_not_found':
        return 'Account not found.';
      case 'invalid_refresh_token':
        return 'Session expired. Please sign in again.';
      case 'access_denied':
        return 'Access was denied.';
      case 'verification_email_sent':
        return 'Verification code sent to your email.';
      case 'email_verified_successful':
        return 'Email successfully verified!';
      case 'reset_password_email_sent':
        return 'Password reset code sent to your email.';
      case 'password_reset_successful':
        return 'Password reset successfully.';
      case 'invalid_otp':
        return 'Invalid verification code.';
      case 'otp_expired':
        return 'Verification code has expired.';
      case 'room_created':
        return 'Burrow room created!';
      case 'room_joined':
        return 'Hopped into the room!';
      case 'room_not_found':
        return 'Room code not found.';
      case 'room_full':
        return 'This room is full.';
      case 'not_your_turn':
        return 'Wait for your turn!';
      case 'invalid_move':
        return 'Invalid move.';
      case 'caro_move_success':
        return 'Move placed.';
      case 'caro_win':
        return 'Caro victory achieved!';
      case 'bingo_win':
        return 'BINGO completed!';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
}
