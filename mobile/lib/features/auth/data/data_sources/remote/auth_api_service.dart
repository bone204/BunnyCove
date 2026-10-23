import 'package:bunny_cove_app/common/constants/app_urls.constant.dart';
import 'package:bunny_cove_app/core/error/failures.dart';
import 'package:bunny_cove_app/core/network/dio_client.dart';
import 'package:bunny_cove_app/features/auth/data/models/user_model.dart';
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

abstract class AuthApiService {
  Future<Either<Failure, Map<String, dynamic>>> signIn({
    required String email,
    required String password,
  });

  Future<Either<Failure, UserModel>> signUp({
    required String email,
    required String password,
    required String username,
    required String displayName,
  });
}

class AuthApiServiceImpl implements AuthApiService {
  final DioClient dioClient;

  AuthApiServiceImpl(this.dioClient);

  @override
  Future<Either<Failure, Map<String, dynamic>>> signIn({
    required String email,
    required String password,
  }) async {
    try {
      final response = await dioClient.dio.post(
        AppUrlsConstant.login,
        data: {'email': email, 'password': password},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data['data'] as Map<String, dynamic>;
        return Right(data);
      }
      return Left(ServerFailure(
        message: response.data['error']?['message'] ?? 'Login failed',
        code: response.data['error']?['code'],
      ));
    } on DioException catch (e) {
      return Left(ServerFailure(
        message: e.response?.data?['error']?['message'] ??
            e.message ??
            'Network error',
        code: e.response?.data?['error']?['code'],
      ));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserModel>> signUp({
    required String email,
    required String password,
    required String username,
    required String displayName,
  }) async {
    try {
      final response = await dioClient.dio.post(
        AppUrlsConstant.register,
        data: {
          'email': email,
          'password': password,
          'username': username,
          'displayName': displayName,
        },
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        final userJson = response.data['data'] as Map<String, dynamic>;
        return Right(UserModel.fromJson(userJson));
      }
      return Left(ServerFailure(
        message: response.data['error']?['message'] ?? 'Registration failed',
        code: response.data['error']?['code'],
      ));
    } on DioException catch (e) {
      return Left(ServerFailure(
        message: e.response?.data?['error']?['message'] ??
            e.message ??
            'Network error',
        code: e.response?.data?['error']?['code'],
      ));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
