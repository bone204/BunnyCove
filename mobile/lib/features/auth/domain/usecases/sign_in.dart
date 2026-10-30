import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:bunny_cove_app/common_libs.dart';

import 'package:bunny_cove_app/features/auth/data/models/user_model.dart';
import 'package:bunny_cove_app/features/auth/domain/repository/auth_repository.dart';

class SignInParams extends Equatable {
  final String email;
  final String password;

  const SignInParams({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class SignInUseCase implements UseCase<UserModel, SignInParams> {
  final AuthRepository repository;

  SignInUseCase(this.repository);

  @override
  Future<Either<Failure, UserModel>> call(SignInParams params) {
    return repository.signIn(email: params.email, password: params.password);
  }
}
