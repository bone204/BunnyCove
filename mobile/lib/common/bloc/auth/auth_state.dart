import 'package:equatable/equatable.dart';

enum AuthStatus { initial, authenticated, unauthenticated }

class AppAuthState extends Equatable {
  final AuthStatus status;
  final String? userId;

  const AppAuthState({
    this.status = AuthStatus.initial,
    this.userId,
  });

  @override
  List<Object?> get props => [status, userId];
}
