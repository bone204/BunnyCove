import 'package:shared_preferences/shared_preferences.dart';
import '../../../../common/constants/storage_keys.constant.dart';

abstract class AuthLocalService {
  Future<void> saveTokens({
    required String accessToken,
    String? refreshToken,
  });

  String? getAccessToken();

  Future<void> clearTokens();

  bool isLoggedIn();
}

class AuthLocalServiceImpl implements AuthLocalService {
  final SharedPreferences prefs;

  AuthLocalServiceImpl(this.prefs);

  @override
  Future<void> saveTokens({
    required String accessToken,
    String? refreshToken,
  }) async {
    await prefs.setString(StorageKeys.accessToken, accessToken);
    if (refreshToken != null) {
      await prefs.setString(StorageKeys.refreshToken, refreshToken);
    }
  }

  @override
  String? getAccessToken() {
    return prefs.getString(StorageKeys.accessToken);
  }

  @override
  Future<void> clearTokens() async {
    await prefs.remove(StorageKeys.accessToken);
    await prefs.remove(StorageKeys.refreshToken);
  }

  @override
  bool isLoggedIn() {
    final token = prefs.getString(StorageKeys.accessToken);
    return token != null && token.isNotEmpty;
  }
}
