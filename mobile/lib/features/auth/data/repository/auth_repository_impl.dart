import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../service_locator.dart';
import '../../domain/repository/auth_repository.dart';
import '../data_sources/local/auth_local_service.dart';
import '../data_sources/remote/auth_api_service.dart';
import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  late final AuthApiService _apiService;
  late final AuthLocalService _localService;

  AuthRepositoryImpl({
    AuthApiService? apiService,
    AuthLocalService? localService,
  }) {
    _apiService = apiService ?? sl<AuthApiService>();
    _localService = localService ?? sl<AuthLocalService>();
  }

  @override
  Future<Either<Failure, UserModel>> signIn({
    required String email,
    required String password,
  }) async {
    final result = await _apiService.signIn(email: email, password: password);
    return result.fold(
      (failure) => Left(failure),
      (data) async {
        final accessToken = data['accessToken'] as String? ?? '';
        final refreshToken = data['refreshToken'] as String?;
        await _localService.saveTokens(
            accessToken: accessToken, refreshToken: refreshToken);

        final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
        await _localService.saveUser(user);
        return Right(user);
      },
    );
  }

  @override
  Future<Either<Failure, UserModel>> signUp({
    required String email,
    required String password,
    required String username,
    required String displayName,
  }) async {
    return await _apiService.signUp(
      email: email,
      password: password,
      username: username,
      displayName: displayName,
    );
  }

  @override
  Future<Either<Failure, bool>> isLoggedIn() async {
    return Right(_localService.isLoggedIn());
  }

  @override
  Future<Either<Failure, void>> signOut() async {
    await _localService.clearAuthData();
    return const Right(null);
  }
}
