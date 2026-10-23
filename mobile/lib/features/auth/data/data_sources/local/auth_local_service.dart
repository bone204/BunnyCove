import 'dart:convert';
import 'package:bunny_cove_app/common/constants/storage_keys.constant.dart';
import 'package:bunny_cove_app/features/auth/data/models/user_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class AuthLocalService {
  Future<void> saveTokens({required String accessToken, String? refreshToken});
  Future<void> saveUser(UserModel user);
  UserModel? getUser();
  String? getAccessToken();
  bool isLoggedIn();
  Future<void> clearAuthData();
}

class AuthLocalServiceImpl implements AuthLocalService {
  final SharedPreferences sharedPreferences;

  AuthLocalServiceImpl(this.sharedPreferences);

  @override
  Future<void> saveTokens(
      {required String accessToken, String? refreshToken}) async {
    await sharedPreferences.setString(
        StorageKeysConstant.accessToken, accessToken);
    if (refreshToken != null) {
      await sharedPreferences.setString(
          StorageKeysConstant.refreshToken, refreshToken);
    }
  }

  @override
  Future<void> saveUser(UserModel user) async {
    await sharedPreferences.setString(
        StorageKeysConstant.userProfile, jsonEncode(user.toJson()));
  }

  @override
  UserModel? getUser() {
    final raw = sharedPreferences.getString(StorageKeysConstant.userProfile);
    if (raw == null) return null;
    try {
      return UserModel.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  @override
  String? getAccessToken() {
    return sharedPreferences.getString(StorageKeysConstant.accessToken);
  }

  @override
  bool isLoggedIn() {
    final token = getAccessToken();
    return token != null && token.isNotEmpty;
  }

  @override
  Future<void> clearAuthData() async {
    await sharedPreferences.remove(StorageKeysConstant.accessToken);
    await sharedPreferences.remove(StorageKeysConstant.refreshToken);
    await sharedPreferences.remove(StorageKeysConstant.userProfile);
  }
}
