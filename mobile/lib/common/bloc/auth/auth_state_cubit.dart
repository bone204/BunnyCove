import 'package:bunny_cove_app/common_libs.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth_state.dart';

class AuthStateCubit extends Cubit<AppAuthState> {
  final SharedPreferences sharedPreferences;

  AuthStateCubit(this.sharedPreferences) : super(const AppAuthState());

  void checkAuth() {
    if (isClosed) return;
    final token = sharedPreferences.getString(StorageKeysConstant.accessToken);
    if (token != null && token.isNotEmpty) {
      emit(const AppAuthState(status: AuthStatus.authenticated));
    } else {
      emit(const AppAuthState(status: AuthStatus.unauthenticated));
    }
  }

  void setAuthenticated(String userId) {
    if (isClosed) return;
    emit(AppAuthState(status: AuthStatus.authenticated, userId: userId));
  }

  void setUnauthenticated() {
    if (isClosed) return;
    sharedPreferences.remove(StorageKeysConstant.accessToken);
    sharedPreferences.remove(StorageKeysConstant.refreshToken);
    emit(const AppAuthState(status: AuthStatus.unauthenticated));
  }
}
