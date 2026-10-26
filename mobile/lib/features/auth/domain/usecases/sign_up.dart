import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../../data/models/user_model.dart';
import '../repository/auth_repository.dart';

class SignUpParams extends Equatable {
  final String email;
  final String password;
  final String username;
  final String displayName;

  const SignUpParams({
    required this.email,
    required this.password,
    required this.username,
    required this.displayName,
  });

  @override
  List<Object?> get props => [email, password, username, displayName];
}

class SignUpUseCase implements UseCase<UserModel, SignUpParams> {
  final AuthRepository repository;

  SignUpUseCase(this.repository);

  @override
  Future<Either<Failure, UserModel>> call(SignUpParams params) {
    return repository.signUp(
      email: params.email,
      password: params.password,
      username: params.username,
      displayName: params.displayName,
    );
  }
}
