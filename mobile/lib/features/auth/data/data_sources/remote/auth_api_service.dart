import 'package:dio/dio.dart';
import '../../../../common/constants/app_urls.constant.dart';
import '../../../../core/network/dio_client.dart';

abstract class AuthApiService {
  Future<Response> login({
    required String email,
    required String password,
  });

  Future<Response> register({
    required String username,
    required String displayName,
    required String email,
    required String password,
  });
}

class AuthApiServiceImpl implements AuthApiService {
  final DioClient dioClient;

  AuthApiServiceImpl(this.dioClient);

  @override
  Future<Response> login({
    required String email,
    required String password,
  }) async {
    return await dioClient.dio.post(
      ApiUrls.login,
      data: {
        'email': email,
        'password': password,
      },
    );
  }

  @override
  Future<Response> register({
    required String username,
    required String displayName,
    required String email,
    required String password,
  }) async {
    return await dioClient.dio.post(
      ApiUrls.register,
      data: {
        'username': username,
        'displayName': displayName,
        'email': email,
        'password': password,
      },
    );
  }
}
