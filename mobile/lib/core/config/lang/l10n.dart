import 'package:flutter/material.dart';
import 'arb/app_localizations.dart';

class L10n {
  static final all = [
    const Locale('en'),
    const Locale('vi'),
  ];
}

extension LocalizationExtension on BuildContext {
  AppLocalizations get l10n => AppLocalizations.of(this)!;
}
