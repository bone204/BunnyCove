import 'dart:io';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../common/constants/app_urls.constant.dart';
import '../../common/constants/storage_keys.constant.dart';
import 'logger_interceptor.dart';

/// Centralized HTTP client wrapper around Dio.
class DioClient {
  late final Dio dio;
  final SharedPreferences prefs;

  DioClient(this.prefs) {
    dio = Dio(
      BaseOptions(
        baseUrl: ApiUrls.baseURL,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        sendTimeout: const Duration(seconds: 15),
        validateStatus: (status) =>
            status != null && status >= 200 && status < 300,
        contentType: Headers.jsonContentType,
      ),
    );

    // 1. Logger Interceptor
    dio.interceptors.add(LoggerInterceptor());

    // 2. Auth Header Interceptor
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = prefs.getString(StorageKeys.accessToken);
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, ErrorInterceptorHandler handler) {
          return handler.next(error);
        },
      ),
    );
  }

  bool isConnectionError(DioException error) {
    return error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.sendTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.connectionError ||
        error.error is SocketException;
  }
}
