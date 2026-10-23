import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../../../common/widgets/button/custom_button.dart';
import '../../../../common/widgets/snackbar/custom_snackbar.dart';
import '../../../../core/config/theme/color.dart';
import '../../../../service_locator.dart';
import '../bloc/auth_cubit.dart';
import '../bloc/auth_state.dart';

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
    return BlocProvider(
      create: (context) => sl<AuthCubit>(),
      child: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: Scaffold(
          backgroundColor: AppColors.creamBackground,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 32.h),
              child: BlocConsumer<AuthCubit, AuthCubitState>(
                listener: (context, state) {
                  if (state is AuthFailure) {
                    CustomSnackBar.show(
                      context,
                      message: state.message,
                      type: SnackBarType.error,
                    );
                  } else if (state is AuthSuccess) {
                    CustomSnackBar.show(
                      context,
                      message: 'Welcome back, ${state.user.displayName}! 🌸',
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
                          child: Text('🐰', style: TextStyle(fontSize: 64.sp)),
                        ),
                        SizedBox(height: 12.h),
                        Center(
                          child: Text(
                            'Bunny Cove',
                            style: TextStyle(
                              fontSize: 26.sp,
                              fontWeight: FontWeight.bold,
                              color: AppColors.deepPlumText,
                            ),
                          ),
                        ),
                        Center(
                          child: Text(
                            'Sign in to enter your cozy universe',
                            style: TextStyle(
                              fontSize: 14.sp,
                              color: AppColors.mutedText,
                            ),
                          ),
                        ),
                        SizedBox(height: 36.h),
                        TextFormField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: InputDecoration(
                            labelText: 'Email',
                            hintText: 'bunny@cove.test',
                            filled: true,
                            fillColor: AppColors.cardSurface,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14.r),
                              borderSide: BorderSide.none,
                            ),
                            prefixIcon: const Icon(Icons.email_outlined),
                          ),
                          validator: (value) => (value == null || value.isEmpty)
                              ? 'Please enter email'
                              : null,
                        ),
                        SizedBox(height: 16.h),
                        TextFormField(
                          controller: _passwordController,
                          obscureText: true,
                          decoration: InputDecoration(
                            labelText: 'Password',
                            filled: true,
                            fillColor: AppColors.cardSurface,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(14.r),
                              borderSide: BorderSide.none,
                            ),
                            prefixIcon: const Icon(Icons.lock_outline),
                          ),
                          validator: (value) => (value == null || value.isEmpty)
                              ? 'Please enter password'
                              : null,
                        ),
                        SizedBox(height: 28.h),
                        CustomButton(
                          text: 'Sign In',
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
