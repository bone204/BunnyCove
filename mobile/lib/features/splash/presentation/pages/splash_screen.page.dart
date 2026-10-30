import 'package:bunny_cove_app/common_libs.dart';

class SplashScreenPage extends StatefulWidget {
  const SplashScreenPage({super.key});

  @override
  State<SplashScreenPage> createState() => _SplashScreenPageState();
}

class _SplashScreenPageState extends State<SplashScreenPage>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..forward();

    _scaleAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticOut,
    );

    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        NavigationUtils.pushReplacementNamed(context, AppRouteConstant.signIn);
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Center(
        child: ScaleTransition(
          scale: _scaleAnimation,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '🐰',
                style: AppTypography.displayLarge.copyWith(fontSize: 80.sp),
              ),
              SizedBox(height: 16.h),
              Text(
                l10n.appName,
                style: Theme.of(context).textTheme.displayMedium ??
                    AppTypography.displayMedium,
              ),
              SizedBox(height: 8.h),
              Text(
                l10n.appTagline,
                style: (Theme.of(context).textTheme.bodyMedium ??
                        AppTypography.bodyMedium)
                    .copyWith(
                  color: Theme.of(context).textTheme.bodySmall?.color,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
