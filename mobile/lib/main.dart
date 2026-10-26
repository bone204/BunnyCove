import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'common/bloc/auth/auth_state_cubit.dart';
import 'common/bloc/lang/locale_cubit.dart';
import 'common/bloc/lang/locale_state.dart';
import 'core/config/lang/arb/app_localizations.dart';
import 'core/config/lang/l10n.dart';
import 'core/config/routes/routes.dart';
import 'core/config/theme/theme.dart';
import 'features/splash/presentation/pages/splash_screen.page.dart';
import 'service_locator.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void main() {
  runZonedGuarded(
    () async {
      WidgetsFlutterBinding.ensureInitialized();

      // Load environment variables (.env)
      try {
        await dotenv.load(fileName: ".env");
      } catch (_) {
        debugPrint('Warning: .env file not found, fallback defaults used.');
      }

      FlutterError.onError = (FlutterErrorDetails details) {
        if (kDebugMode &&
            (details.exception.toString().contains('mouse_tracker.dart') ||
                details.exception.toString().contains('!_debugLocked'))) {
          debugPrint('Framework assertion filtered: ${details.exception}');
          return;
        }

        FlutterError.presentError(details);
        Zone.current.handleUncaughtError(
          details.exception,
          details.stack ?? StackTrace.empty,
        );
      };

      // Initialize SharedPreferences & Service Locator
      final prefs = await SharedPreferences.getInstance();
      setUpServiceLocator(prefs);

      runApp(const BunnyCoveApp());
    },
    (error, stackTrace) {
      debugPrint('UNCAUGHT ERROR: $error');
      debugPrint('STACKTRACE: $stackTrace');
    },
  );
}

class BunnyCoveApp extends StatelessWidget {
  const BunnyCoveApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => AuthStateCubit()..appStarted()),
        BlocProvider(create: (context) => LocaleCubit()),
      ],
      child: ScreenUtilInit(
        designSize: const Size(390, 844),
        minTextAdapt: true,
        splitScreenMode: true,
        builder: (context, child) {
          return BlocBuilder<LocaleCubit, LocaleState>(
            builder: (context, state) {
              Locale locale = const Locale('en');
              if (state is LocaleLoaded) {
                locale = state.locale;
              }

              return MaterialApp(
                navigatorKey: navigatorKey,
                title: 'Bunny Cove',
                theme: AppTheme.lightTheme,
                onGenerateRoute: AppRouter.generateRoute,
                debugShowCheckedModeBanner: false,
                supportedLocales: L10n.all,
                locale: locale,
                localizationsDelegates: const [
                  AppLocalizations.delegate,
                  GlobalMaterialLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                ],
                home: const SplashScreenPage(),
              );
            },
          );
        },
      ),
    );
  }
}
