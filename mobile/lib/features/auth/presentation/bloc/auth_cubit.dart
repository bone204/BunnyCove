import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/usecases/sign_in.dart';
import '../../domain/usecases/sign_up.dart';
import 'auth_state.dart';

/// Presentation Cubit handling sign-in and sign-up form submissions.
class AuthCubit extends Cubit<AuthPresentationState> {
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

    final result = await signInUseCase.call(
      SignInParams(email: email, password: password),
    );

    if (isClosed) return;

    result.fold(
      (failure) => emit(
        AuthFailureState(message: failure.message, code: failure.code),
      ),
      (user) => emit(AuthSuccess(user)),
    );
  }

  Future<void> signUp({
    required String username,
    required String displayName,
    required String email,
    required String password,
  }) async {
    if (isClosed) return;
    emit(AuthLoading());

    final result = await signUpUseCase.call(
      SignUpParams(
        username: username,
        displayName: displayName,
        email: email,
        password: password,
      ),
    );

    if (isClosed) return;

    result.fold(
      (failure) => emit(
        AuthFailureState(message: failure.message, code: failure.code),
      ),
      (user) => emit(AuthSuccess(user)),
    );
  }
}
