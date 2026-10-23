import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../common/bloc/auth/auth_state_cubit.dart';
import '../../../../common/constants/app_colors.dart';
import '../../../../common/widgets/button/custom_button.dart';
import '../../../../common/widgets/snackbar/custom_snackbar.dart';
import '../../../../core/config/lang/arb/app_localizations.dart';
import '../../../../core/utils/navigation_utils.dart';
import '../../../../service_locator.dart';
import '../bloc/auth_cubit.dart';
import '../bloc/auth_state.dart';

/// Sign In screen adhering to Clean Architecture and Cozy Pastel UI standards.
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
    FocusScope.of(context).unfocus();
    if (_formKey.currentState?.validate() ?? false) {
      context.read<AuthCubit>().signIn(
            email: _emailController.text.trim(),
            password: _passwordController.text,
          );
    }
  }

  void _onForgotPasswordPressed() {
    // Navigate to forgot password flow when implemented
  }

  void _onSignUpNavigatePressed() {
    // Navigate to sign up flow when implemented
  }

  void _dismissKeyboard() {
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final textTheme = Theme.of(context).textTheme;

    return BlocProvider(
      create: (context) => sl<AuthCubit>(),
      child: BlocConsumer<AuthCubit, AuthPresentationState>(
        listener: (context, state) {
          if (state is AuthSuccess) {
            context.read<AuthStateCubit>().setAuthenticated();
            CustomSnackBar.show(
              context,
              message: l10n.code_login_successful,
              type: SnackBarType.success,
            );
          } else if (state is AuthFailureState) {
            final translated = l10n.translateResponseCode(state.code);
            CustomSnackBar.show(
              context,
              message: translated.isNotEmpty ? translated : state.message,
              type: SnackBarType.error,
            );
          }
        },
        builder: (context, state) {
          final isLoading = state is AuthLoading;

          return GestureDetector(
            onTap: _dismissKeyboard,
            child: Scaffold(
              body: SafeArea(
                child: SingleChildScrollView(
                  padding: EdgeInsets.symmetric(horizontal: 20.w),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        SizedBox(height: 40.h),
                        // Mascot & Header
                        Center(
                          child: Container(
                            width: 88.w,
                            height: 88.w,
                            decoration: BoxDecoration(
                              color: AppColors.primaryLight.withOpacity(0.4),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                '🐰',
                                style: TextStyle(fontSize: 44.sp),
                              ),
                            ),
                          ),
                        ),
                        SizedBox(height: 20.h),
                        Text(
                          l10n.signInTitle,
                          style: textTheme.displaySmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 6.h),
                        Text(
                          l10n.welcomeSubtitle,
                          style: textTheme.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 36.h),

                        // Email Field
                        Text(
                          l10n.emailLabel,
                          style: textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 8.h),
                        TextFormField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: InputDecoration(
                            hintText: l10n.emailLabel,
                            prefixIcon: const Icon(
                              Icons.mail_outline_rounded,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return l10n.code_validation_error;
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 18.h),

                        // Password Field
                        Text(
                          l10n.passwordLabel,
                          style: textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 8.h),
                        TextFormField(
                          controller: _passwordController,
                          obscureText: true,
                          decoration: InputDecoration(
                            hintText: l10n.passwordLabel,
                            prefixIcon: const Icon(
                              Icons.lock_outline_rounded,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return l10n.code_validation_error;
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 12.h),

                        // Forgot Password
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: _onForgotPasswordPressed,
                            child: Text(
                              l10n.forgotPassword,
                              style: textTheme.bodySmall?.copyWith(
                                color: AppColors.primaryDark,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                        SizedBox(height: 20.h),

                        // Sign In CTA
                        CustomButton(
                          text: l10n.signInTitle,
                          isLoading: isLoading,
                          onPressed: () => _onSignInPressed(context),
                        ),
                        SizedBox(height: 24.h),

                        // Switch to Sign Up
                        Center(
                          child: GestureDetector(
                            onTap: _onSignUpNavigatePressed,
                            child: Text(
                              l10n.dontHaveAccount,
                              style: textTheme.bodySmall?.copyWith(
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                        SizedBox(height: 40.h),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
