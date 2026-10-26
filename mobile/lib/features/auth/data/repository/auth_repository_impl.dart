import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../../../core/error/failures.dart';
import '../../../../service_locator.dart';
import '../../domain/repository/auth_repository.dart';
import '../data_sources/local/auth_local_service.dart';
import '../data_sources/remote/auth_api_service.dart';
import '../models/user_model.dart';

/// Implementation of AuthRepository using Service Locator for dependencies.
class AuthRepositoryImpl implements AuthRepository {
  final AuthApiService _apiService = sl<AuthApiService>();
  final AuthLocalService _localService = sl<AuthLocalService>();

  @override
  Future<Either<Failure, UserModel>> signIn({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiService.login(
        email: email,
        password: password,
      );

      final data = response.data;
      if (data is Map<String, dynamic> && data['success'] == true) {
        final payload = data['data'] as Map<String, dynamic>;
        final token = payload['accessToken'] as String? ?? '';
        final refreshToken = payload['refreshToken'] as String?;
        await _localService.saveTokens(
          accessToken: token,
          refreshToken: refreshToken,
        );

        final user = UserModel.fromJson(payload['user'] as Map<String, dynamic>);
        return Right(user);
      } else {
        final error = data['error'] as Map<String, dynamic>?;
        final code = error?['code'] as String?;
        final message = error?['message'] as String? ?? 'Sign in failed';
        return Left(ServerFailure(message: message, code: code));
      }
    } on DioException catch (e) {
      final errorData = e.response?.data;
      String? code;
      String message = 'Network communication error';

      if (errorData is Map<String, dynamic> && errorData['error'] != null) {
        final errorObj = errorData['error'] as Map<String, dynamic>;
        code = errorObj['code'] as String?;
        message = errorObj['message'] as String? ?? message;
      }
      return Left(ServerFailure(
        message: message,
        code: code,
        statusCode: e.response?.statusCode,
      ));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserModel>> signUp({
    required String username,
    required String displayName,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiService.register(
        username: username,
        displayName: displayName,
        email: email,
        password: password,
      );

      final data = response.data;
      if (data is Map<String, dynamic> && data['success'] == true) {
        final payload = data['data'] as Map<String, dynamic>;
        final token = payload['accessToken'] as String? ?? '';
        final refreshToken = payload['refreshToken'] as String?;
        await _localService.saveTokens(
          accessToken: token,
          refreshToken: refreshToken,
        );

        final user = UserModel.fromJson(payload['user'] as Map<String, dynamic>);
        return Right(user);
      } else {
        final error = data['error'] as Map<String, dynamic>?;
        final code = error?['code'] as String?;
        final message = error?['message'] as String? ?? 'Registration failed';
        return Left(ServerFailure(message: message, code: code));
      }
    } on DioException catch (e) {
      final errorData = e.response?.data;
      String? code;
      String message = 'Network communication error';

      if (errorData is Map<String, dynamic> && errorData['error'] != null) {
        final errorObj = errorData['error'] as Map<String, dynamic>;
        code = errorObj['code'] as String?;
        message = errorObj['message'] as String? ?? message;
      }
      return Left(ServerFailure(
        message: message,
        code: code,
        statusCode: e.response?.statusCode,
      ));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<bool> isLoggedIn() async {
    return _localService.isLoggedIn();
  }

  @override
  Future<Either<Failure, void>> signOut() async {
    try {
      await _localService.clearTokens();
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(message: e.toString()));
    }
  }
}
