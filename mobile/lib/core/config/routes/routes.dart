import 'package:flutter/material.dart';
import '../../../../common/constants/app_route.constant.dart';
import '../../../../features/splash/presentation/pages/splash_screen.page.dart';
import '../../../../features/auth/presentation/pages/sign_in.page.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRouteConstant.splash:
        return _buildSlideRoute(const SplashScreenPage(), settings);
      case AppRouteConstant.signIn:
        return _buildSlideRoute(const SignInPage(), settings);
      default:
        return _buildSlideRoute(
          Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
          settings,
        );
    }
  }

  static PageRouteBuilder _buildSlideRoute(Widget page, RouteSettings settings) {
    return PageRouteBuilder(
      settings: settings,
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.easeInOutCubic;
        final tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
        return SlideTransition(
          position: animation.drive(tween),
          child: child,
        );
      },
      transitionDuration: const Duration(milliseconds: 300),
    );
  }
}
