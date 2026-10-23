import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'common/bloc/auth/auth_state_cubit.dart';
import 'common/bloc/lang/locale_cubit.dart';
import 'common/bloc/lang/locale_state.dart';
import 'common/constants/app_route.constant.dart';
import 'core/config/lang/l10n.dart';
import 'core/config/routes/routes.dart';
import 'core/config/theme/theme.dart';
import 'service_locator.dart';

void main() async {
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();

    // 1. Load environment variables
    try {
      await dotenv.load(fileName: '.env');
    } catch (_) {
      // Fallback if .env does not exist
    }

    // 2. Initialize SharedPreferences & Dependency Injection
    final sharedPreferences = await SharedPreferences.getInstance();
    setUpServiceLocator(sharedPreferences);

    // 3. Check initial authentication state
    sl<AuthStateCubit>().checkAuth();

    runApp(const BunnyCoveApp());
  }, (error, stack) {
    debugPrint('Global error: $error\n$stack');
  });
}

class BunnyCoveApp extends StatelessWidget {
  const BunnyCoveApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(393, 852), // iPhone viewport standard
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return MultiBlocProvider(
          providers: [
            BlocProvider<AuthStateCubit>.value(value: sl<AuthStateCubit>()),
            BlocProvider<LocaleCubit>.value(value: sl<LocaleCubit>()),
          ],
          child: BlocBuilder<LocaleCubit, LocaleState>(
            builder: (context, localeState) {
              return MaterialApp(
                title: 'Bunny Cove',
                debugShowCheckedModeBanner: false,
                theme: AppTheme.lightTheme,
                locale: localeState.locale,
                supportedLocales: L10n.all,
                localizationsDelegates: const [
                  GlobalMaterialLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                ],
                initialRoute: AppRouteConstant.splash,
                onGenerateRoute: AppRouter.generateRoute,
              );
            },
          ),
        );
      },
    );
  }
}
