import 'package:bunny_cove_app/common_libs.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'logger_interceptor.dart';

class DioClient {
  late final Dio dio;
  final SharedPreferences sharedPreferences;

  DioClient(this.sharedPreferences) {
    final baseUrl = AppUrlsConstant.baseApiUrl;
    dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.addAll([
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token =
              sharedPreferences.getString(StorageKeysConstant.accessToken);
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          return handler.next(error);
        },
      ),
      LoggerInterceptor(),
    ]);
  }
}
