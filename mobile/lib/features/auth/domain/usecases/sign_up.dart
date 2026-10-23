import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../../data/models/user_model.dart';
import '../repository/auth_repository.dart';

class SignUpParams extends Equatable {
  final String username;
  final String displayName;
  final String email;
  final String password;

  const SignUpParams({
    required this.username,
    required this.displayName,
    required this.email,
    required this.password,
  });

  @override
  List<Object?> get props => [username, displayName, email, password];
}

class SignUpUseCase implements UseCase<Either<Failure, UserModel>, SignUpParams> {
  final AuthRepository repository;

  SignUpUseCase(this.repository);

  @override
  Future<Either<Failure, UserModel>> call(SignUpParams param) {
    return repository.signUp(
      username: param.username,
      displayName: param.displayName,
      email: param.email,
      password: param.password,
    );
  }
}
