import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/usecases/no_params.dart';
import '../../../features/auth/domain/usecases/is_logged_in.dart';
import '../../../service_locator.dart';
import 'auth_state.dart';

/// Cubit managing the global authentication state of the application.
class AuthStateCubit extends Cubit<AuthState> {
  AuthStateCubit() : super(AppInitialState());

  Future<void> appStarted() async {
    try {
      final isLoggedIn = await sl<IsLoggedInUseCase>().call(NoParams());
      if (isClosed) return;

      if (isLoggedIn) {
        emit(Authenticated());
      } else {
        emit(UnAuthenticated());
      }
    } catch (_) {
      if (isClosed) return;
      emit(UnAuthenticated());
    }
  }

  void setAuthenticated() {
    if (isClosed) return;
    emit(Authenticated());
  }

  void setUnAuthenticated() {
    if (isClosed) return;
    emit(UnAuthenticated());
  }
}
