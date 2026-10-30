import 'package:dartz/dartz.dart';
import 'package:bunny_cove_app/common_libs.dart';
import 'package:bunny_cove_app/features/auth/data/models/user_model.dart';

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
