import '../../../../core/usecases/no_params.dart';
import '../../../../core/usecases/usecase.dart';
import '../repository/auth_repository.dart';

class IsLoggedInUseCase implements UseCase<bool, NoParams> {
  final AuthRepository repository;

  IsLoggedInUseCase(this.repository);

  @override
  Future<bool> call(NoParams param) {
    return repository.isLoggedIn();
  }
}
