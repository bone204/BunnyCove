import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'core/network/dio_client.dart';
import 'features/auth/data/data_sources/local/auth_local_service.dart';
import 'features/auth/data/data_sources/remote/auth_api_service.dart';
import 'features/auth/data/repository/auth_repository_impl.dart';
import 'features/auth/domain/repository/auth_repository.dart';
import 'features/auth/domain/usecases/is_logged_in.dart';
import 'features/auth/domain/usecases/sign_in.dart';
import 'features/auth/domain/usecases/sign_up.dart';
import 'features/auth/presentation/bloc/auth_cubit.dart';
import 'common/bloc/auth/auth_state_cubit.dart';
import 'common/bloc/lang/locale_cubit.dart';
import 'common/bloc/theme/theme_cubit.dart';

final sl = GetIt.instance;

void setUpServiceLocator(SharedPreferences prefs) {
  // 1. External & Core
  sl.registerLazySingleton<SharedPreferences>(() => prefs);
  sl.registerLazySingleton<DioClient>(() => DioClient(sl<SharedPreferences>()));

  // 2. Data Sources
  sl.registerLazySingleton<AuthApiService>(
    () => AuthApiServiceImpl(sl<DioClient>()),
  );
  sl.registerLazySingleton<AuthLocalService>(
    () => AuthLocalServiceImpl(sl<SharedPreferences>()),
  );

  // 3. Repositories
  sl.registerLazySingleton<AuthRepository>(() => AuthRepositoryImpl());

  // 4. Use Cases
  sl.registerLazySingleton<IsLoggedInUseCase>(
    () => IsLoggedInUseCase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton<SignInUseCase>(
    () => SignInUseCase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton<SignUpUseCase>(
    () => SignUpUseCase(sl<AuthRepository>()),
  );

  // 5. Cubits / Presentation
  sl.registerLazySingleton<AuthStateCubit>(
    () => AuthStateCubit(sl<SharedPreferences>()),
  );
  sl.registerLazySingleton<LocaleCubit>(
    () => LocaleCubit(sl<SharedPreferences>()),
  );
  sl.registerLazySingleton<ThemeCubit>(
    () => ThemeCubit(sl<SharedPreferences>()),
  );
  sl.registerFactory<AuthCubit>(
    () => AuthCubit(
      signInUseCase: sl<SignInUseCase>(),
      signUpUseCase: sl<SignUpUseCase>(),
    ),
  );
}
