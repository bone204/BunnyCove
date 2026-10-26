import 'package:equatable/equatable.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AppInitialState extends AuthState {}

class Authenticated extends AuthState {}

class UnAuthenticated extends AuthState {}
