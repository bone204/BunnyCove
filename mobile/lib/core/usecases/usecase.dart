import 'package:dartz/dartz.dart';
import 'package:bunny_cove_app/core/error/failures.dart';

abstract class UseCase<T, Params> {
  Future<Either<Failure, T>> call(Params params);
}
