import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../common/bloc/auth/auth_state.dart';
import '../../../../common/bloc/auth/auth_state_cubit.dart';
import '../../../../common/constants/app_colors.dart';
import '../../../../common/constants/app_route.constant.dart';
import '../../../../core/config/lang/arb/app_localizations.dart';
import '../../../../core/utils/navigation_utils.dart';

/// Splash Screen featuring the Bunny Cove mascot and checking authentication state.
class SplashScreenPage extends StatefulWidget {
  const SplashScreenPage({super.key});

  @override
  State<SplashScreenPage> createState() => _SplashScreenPageState();
}

class _SplashScreenPageState extends State<SplashScreenPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _initAnimations();
    _scheduleNavigation();
  }

  void _initAnimations() {
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    _scaleAnimation = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOutBack,
      ),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeIn,
      ),
    );

    _controller.forward();
  }

  void _scheduleNavigation() {
    _timer = Timer(const Duration(milliseconds: 1800), () {
      if (!mounted) return;
      _proceedToNextScreen();
    });
  }

  void _proceedToNextScreen() {
    final authState = context.read<AuthStateCubit>().state;
    if (authState is Authenticated) {
      // Navigate to Home when Home feature is created
      NavigationUtils.pushReplacementNamed(
        context,
        AppRouteConstant.signIn,
      );
    } else {
      NavigationUtils.pushReplacementNamed(
        context,
        AppRouteConstant.signIn,
      );
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Opacity(
                opacity: _fadeAnimation.value,
                child: Transform.scale(
                  scale: _scaleAnimation.value,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Cozy Bunny Mascot Circle
                      Container(
                        width: 120.w,
                        height: 120.w,
                        decoration: BoxDecoration(
                          color: AppColors.primaryLight.withOpacity(0.5),
                          shape: BoxShape.circle,
                          boxShadow: const [
                            BoxShadow(
                              color: AppColors.shadowLight,
                              blurRadius: 20,
                              offset: Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Center(
                          child: Text(
                            '🐰',
                            style: TextStyle(fontSize: 64.sp),
                          ),
                        ),
                      ),
                      SizedBox(height: 24.h),
                      Text(
                        l10n?.appName ?? 'Bunny Cove',
                        style: textTheme.displayMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.5,
                        ),
                      ),
                      SizedBox(height: 8.h),
                      Text(
                        l10n?.appTagline ?? 'Cozy Social Gaming Universe',
                        style: textTheme.bodyMedium?.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
