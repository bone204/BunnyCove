import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../../data/models/user_model.dart';
import '../repository/auth_repository.dart';

class SignInParams extends Equatable {
  final String email;
  final String password;

  const SignInParams({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class SignInUseCase implements UseCase<Either<Failure, UserModel>, SignInParams> {
  final AuthRepository repository;

  SignInUseCase(this.repository);

  @override
  Future<Either<Failure, UserModel>> call(SignInParams param) {
    return repository.signIn(email: param.email, password: param.password);
  }
}
