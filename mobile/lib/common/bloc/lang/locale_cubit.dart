import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../constants/storage_keys.constant.dart';
import 'locale_state.dart';

/// Cubit managing dynamic language switching and persistence.
class LocaleCubit extends Cubit<LocaleState> {
  LocaleCubit() : super(LocaleLoading()) {
    _loadSavedLocale();
  }

  Future<void> _loadSavedLocale() async {
    final prefs = await SharedPreferences.getInstance();
    final code = prefs.getString(StorageKeys.activeLocale);
    if (isClosed) return;

    if (code != null) {
      emit(LocaleLoaded(Locale(code)));
    } else {
      emit(const LocaleLoaded(Locale('en')));
    }
  }

  Future<void> setLocale(Locale locale) async {
    if (isClosed) return;
    emit(LocaleLoading());

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(StorageKeys.activeLocale, locale.languageCode);

    if (isClosed) return;
    emit(LocaleLoaded(locale));
  }
}
