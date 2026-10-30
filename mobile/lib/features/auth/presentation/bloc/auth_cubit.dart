import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:bunny_cove_app/features/auth/domain/usecases/sign_in.dart';
import 'package:bunny_cove_app/features/auth/domain/usecases/sign_up.dart';
import 'auth_state.dart';

class AuthCubit extends Cubit<AuthCubitState> {
  final SignInUseCase signInUseCase;
  final SignUpUseCase signUpUseCase;

  AuthCubit({
    required this.signInUseCase,
    required this.signUpUseCase,
  }) : super(AuthInitial());

  Future<void> signIn({
    required String email,
    required String password,
  }) async {
    if (isClosed) return;
    emit(AuthLoading());

    final result = await signInUseCase(SignInParams(
      email: email,
      password: password,
    ));

    if (isClosed) return;
    result.fold(
      (failure) =>
          emit(AuthFailure(message: failure.message, code: failure.code)),
      (user) => emit(AuthSuccess(user)),
    );
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String username,
    required String displayName,
  }) async {
    if (isClosed) return;
    emit(AuthLoading());

    final result = await signUpUseCase(SignUpParams(
      email: email,
      password: password,
      username: username,
      displayName: displayName,
    ));

    if (isClosed) return;
    result.fold(
      (failure) =>
          emit(AuthFailure(message: failure.message, code: failure.code)),
      (user) => emit(AuthSuccess(user)),
    );
  }
}
