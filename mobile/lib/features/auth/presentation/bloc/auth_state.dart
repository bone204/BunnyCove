import 'package:equatable/equatable.dart';
import 'package:bunny_cove_app/features/auth/data/models/user_model.dart';

abstract class AuthCubitState extends Equatable {
  const AuthCubitState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthCubitState {}

class AuthLoading extends AuthCubitState {}

class AuthSuccess extends AuthCubitState {
  final UserModel user;

  const AuthSuccess(this.user);

  @override
  List<Object?> get props => [user];
}

class AuthFailure extends AuthCubitState {
  final String message;
  final String? code;

  const AuthFailure({required this.message, this.code});

  @override
  List<Object?> get props => [message, code];
}
