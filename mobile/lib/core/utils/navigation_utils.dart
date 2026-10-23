import 'package:flutter/material.dart';

/// Centralized navigation utility handling smooth transitions and keyboard dismissal.
class NavigationUtils {
  static Future<T?> pushNamed<T extends Object?>(
    BuildContext context,
    String routeName, {
    Object? arguments,
  }) {
    FocusScope.of(context).unfocus();
    return Navigator.pushNamed<T>(context, routeName, arguments: arguments);
  }

  static Future<T?> pushReplacementNamed<T extends Object?, TO extends Object?>(
    BuildContext context,
    String routeName, {
    TO? result,
    Object? arguments,
  }) {
    FocusScope.of(context).unfocus();
    return Navigator.pushReplacementNamed<T, TO>(
      context,
      routeName,
      result: result,
      arguments: arguments,
    );
  }

  static Future<T?> pushNamedAndRemoveUntil<T extends Object?>(
    BuildContext context,
    String newRouteName,
    bool Function(Route<dynamic>) predicate, {
    Object? arguments,
  }) {
    FocusScope.of(context).unfocus();
    return Navigator.pushNamedAndRemoveUntil<T>(
      context,
      newRouteName,
      predicate,
      arguments: arguments,
    );
  }

  static Future<void> pop<T extends Object?>(
    BuildContext context, [
    T? result,
  ]) async {
    FocusManager.instance.primaryFocus?.unfocus();
    await Future.delayed(const Duration(milliseconds: 100));
    if (context.mounted && Navigator.canPop(context)) {
      Navigator.pop<T>(context, result);
    }
  }
}
