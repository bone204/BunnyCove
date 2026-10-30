import 'package:bunny_cove_app/common_libs.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeCubit extends Cubit<ThemeState> {
  final SharedPreferences sharedPreferences;

  ThemeCubit(this.sharedPreferences)
      : super(ThemeState(_getInitialThemeMode(sharedPreferences)));

  static ThemeMode _getInitialThemeMode(SharedPreferences prefs) {
    final savedMode = prefs.getString(StorageKeysConstant.themeMode);
    if (savedMode == 'dark') {
      return ThemeMode.dark;
    } else if (savedMode == 'light') {
      return ThemeMode.light;
    }
    return ThemeMode.system;
  }

  void setThemeMode(ThemeMode mode) {
    if (isClosed) return;
    sharedPreferences.setString(
      StorageKeysConstant.themeMode,
      mode == ThemeMode.dark
          ? 'dark'
          : mode == ThemeMode.light
              ? 'light'
              : 'system',
    );
    emit(ThemeState(mode));
  }

  void toggleTheme() {
    final nextMode =
        state.themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    setThemeMode(nextMode);
  }
}

