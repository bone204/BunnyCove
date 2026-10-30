import 'package:dartz/dartz.dart';
import 'package:bunny_cove_app/common_libs.dart';


import 'package:bunny_cove_app/features/auth/domain/repository/auth_repository.dart';

class IsLoggedInUseCase implements UseCase<bool, NoParams> {
  final AuthRepository repository;

  IsLoggedInUseCase(this.repository);

  @override
  Future<Either<Failure, bool>> call(NoParams params) {
    return repository.isLoggedIn();
  }
}
