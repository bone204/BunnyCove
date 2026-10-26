import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../constants/storage_keys.constant.dart';
import 'locale_state.dart';

class LocaleCubit extends Cubit<LocaleState> {
  final SharedPreferences sharedPreferences;

  LocaleCubit(this.sharedPreferences)
      : super(LocaleState(
          Locale(
              sharedPreferences.getString(StorageKeysConstant.language) ?? 'vi'),
        ));

  void setLocale(Locale locale) {
    if (isClosed) return;
    sharedPreferences.setString(
        StorageKeysConstant.language, locale.languageCode);
    emit(LocaleState(locale));
  }
}
