import 'package:equatable/equatable.dart';
import '../../data/models/user_model.dart';

abstract class AuthPresentationState extends Equatable {
  const AuthPresentationState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthPresentationState {}

class AuthLoading extends AuthPresentationState {}

class AuthSuccess extends AuthPresentationState {
  final UserModel user;

  const AuthSuccess(this.user);

  @override
  List<Object?> get props => [user];
}

class AuthFailureState extends AuthPresentationState {
  final String message;
  final String? code;

  const AuthFailureState({required this.message, this.code});

  @override
  List<Object?> get props => [message, code];
}
