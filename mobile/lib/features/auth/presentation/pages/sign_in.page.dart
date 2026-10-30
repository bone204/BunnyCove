import 'package:bunny_cove_app/common_libs.dart';
import 'package:bunny_cove_app/service_locator.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:bunny_cove_app/features/auth/presentation/bloc/auth_cubit.dart';
import 'package:bunny_cove_app/features/auth/presentation/bloc/auth_state.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onSignInPressed(BuildContext context) {
    if (_formKey.currentState?.validate() ?? false) {
      context.read<AuthCubit>().signIn(
            email: _emailController.text.trim(),
            password: _passwordController.text,
          );
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return BlocProvider(
      create: (context) => sl<AuthCubit>(),
      child: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: Scaffold(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 32.h),
              child: BlocConsumer<AuthCubit, AuthCubitState>(
                listener: (context, state) {
                  if (state is AuthFailure) {
                    CustomSnackBar.show(
                      context,
                      message: context.getLocalizedError(
                        state.code,
                        fallback: state.message,
                      ),
                      type: SnackBarType.error,
                    );
                  } else if (state is AuthSuccess) {
                    CustomSnackBar.show(
                      context,
                      message: context.l10n.welcomeBack(state.user.displayName),
                      type: SnackBarType.success,
                    );
                  }
                },
                builder: (context, state) {
                  final isLoading = state is AuthLoading;
                  return Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        SizedBox(height: 30.h),
                        Center(
                          child: Text(
                            '🐰',
                            style: AppTypography.displayLarge.copyWith(fontSize: 64.sp),
                          ),
                        ),
                        SizedBox(height: 12.h),
                        Center(
                          child: Text(
                            l10n.appName,
                            style: Theme.of(context).textTheme.displaySmall ??
                                AppTypography.displaySmall,
                          ),
                        ),
                        Center(
                          child: Text(
                            l10n.signInDescription,
                            style: (Theme.of(context).textTheme.bodyMedium ??
                                    AppTypography.bodyMedium)
                                .copyWith(
                              color: Theme.of(context).textTheme.bodySmall?.color,
                            ),
                          ),
                        ),
                        SizedBox(height: 36.h),
                        CustomTextField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          labelText: l10n.email,
                          hintText: l10n.emailHint,
                          prefixIcon: const Icon(Icons.email_outlined),
                          validator: (value) => (value == null || value.isEmpty)
                              ? l10n.pleaseEnterEmail
                              : null,
                        ),
                        SizedBox(height: 16.h),
                        CustomTextField(
                          controller: _passwordController,
                          obscureText: true,
                          labelText: l10n.password,
                          hintText: '••••••••',
                          prefixIcon: const Icon(Icons.lock_outline),
                          textInputAction: TextInputAction.done,
                          onFieldSubmitted: (_) => _onSignInPressed(context),
                          validator: (value) => (value == null || value.isEmpty)
                              ? l10n.pleaseEnterPassword
                              : null,
                        ),
                        SizedBox(height: 28.h),
                        CustomButton(
                          text: l10n.signIn,
                          isLoading: isLoading,
                          onPressed: () => _onSignInPressed(context),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
