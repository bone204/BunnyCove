import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../data/models/user_model.dart';

abstract class AuthRepository {
  Future<Either<Failure, UserModel>> signIn({
    required String email,
    required String password,
  });

  Future<Either<Failure, UserModel>> signUp({
    required String email,
    required String password,
    required String username,
    required String displayName,
  });

  Future<Either<Failure, bool>> isLoggedIn();
  Future<Either<Failure, void>> signOut();
}
