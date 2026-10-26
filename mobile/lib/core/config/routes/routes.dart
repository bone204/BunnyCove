import 'package:flutter/material.dart';
import '../../../common/constants/app_route.constant.dart';
import '../lang/arb/app_localizations.dart';
import '../../../features/splash/presentation/pages/splash_screen.page.dart';
import '../../../features/auth/presentation/pages/sign_in.page.dart';

/// Centralized route generator utilizing slide transitions.
class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRouteConstant.initial:
      case AppRouteConstant.splash:
        return _buildSlideRoute(
          settings: settings,
          page: const SplashScreenPage(),
        );

      case AppRouteConstant.signIn:
        return _buildSlideRoute(
          settings: settings,
          page: const SignInPage(),
        );

      default:
        return MaterialPageRoute(
          settings: settings,
          builder: (context) {
            final l10n = AppLocalizations.of(context);
            final routeName = settings.name ?? 'unknown';
            return Scaffold(
              body: Center(
                child: Text(
                  l10n != null
                      ? l10n.noRouteDefined(routeName)
                      : 'No route defined for $routeName',
                ),
              ),
            );
          },
        );
    }
  }

  /// Builds a smooth right-to-left slide transition route.
  static PageRouteBuilder<T> _buildSlideRoute<T>({
    required RouteSettings settings,
    required Widget page,
    Duration duration = const Duration(milliseconds: 300),
  }) {
    return PageRouteBuilder<T>(
      settings: settings,
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: duration,
      reverseTransitionDuration: duration,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.easeInOutCubic;

        final tween =
            Tween(begin: begin, end: end).chain(CurveTween(curve: curve));

        return SlideTransition(
          position: animation.drive(tween),
          child: child,
        );
      },
    );
  }
}
