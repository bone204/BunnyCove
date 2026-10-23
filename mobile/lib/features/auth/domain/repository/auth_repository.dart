import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../data/models/user_model.dart';

/// Domain contract for authentication operations.
abstract class AuthRepository {
  Future<Either<Failure, UserModel>> signIn({
    required String email,
    required String password,
  });

  Future<Either<Failure, UserModel>> signUp({
    required String username,
    required String displayName,
    required String email,
    required String password,
  });

  Future<bool> isLoggedIn();

  Future<Either<Failure, void>> signOut();
}
