import 'package:dio/dio.dart';
import 'package:logger/logger.dart';

/// Interceptor for logging HTTP requests and responses.
class LoggerInterceptor extends Interceptor {
  final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 0,
      errorMethodCount: 5,
      lineLength: 80,
      colors: true,
      printEmojis: true,
    ),
  );

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    _logger.d('--> ${options.method.toUpperCase()} ${options.uri}');
    super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    _logger.i('<-- ${response.statusCode} ${response.requestOptions.uri}');
    super.onResponse(response, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    _logger.e(
      '<-- ERROR ${err.response?.statusCode} ${err.requestOptions.uri}: ${err.message}',
    );
    super.onError(err, handler);
  }
}
