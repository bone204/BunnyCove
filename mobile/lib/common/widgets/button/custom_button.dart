import 'package:bunny_cove_app/common_libs.dart';
import 'package:flutter/services.dart';

enum ButtonVariant { primary, secondary, ghost, danger }

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final bool isLoading;
  final Widget? leadingIcon;
  final Widget? trailingIcon;
  final double? width;
  final double? height;
  final Color? customBackgroundColor;
  final Color? customTextColor;

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.variant = ButtonVariant.primary,
    this.isLoading = false,
    this.leadingIcon,
    this.trailingIcon,
    this.width,
    this.height,
    this.customBackgroundColor,
    this.customTextColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    Color bg;
    Color fg;
    BorderSide border = BorderSide.none;

    switch (variant) {
      case ButtonVariant.primary:
        bg = customBackgroundColor ?? theme.colorScheme.primary;
        fg = customTextColor ?? (isDark ? theme.scaffoldBackgroundColor : Colors.white);
        break;
      case ButtonVariant.secondary:
        bg = customBackgroundColor ?? theme.colorScheme.surface;
        fg = customTextColor ?? (isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary);
        border = BorderSide(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1.5,
        );
        break;
      case ButtonVariant.ghost:
        bg = Colors.transparent;
        fg = customTextColor ?? theme.colorScheme.primary;
        break;
      case ButtonVariant.danger:
        bg = customBackgroundColor ?? (isDark ? AppColors.darkError : AppColors.error);
        fg = customTextColor ?? Colors.white;
        break;
    }

    return SizedBox(
      width: width ?? double.infinity,
      height: height ?? 52.h,
      child: ElevatedButton(
        onPressed: isLoading
            ? null
            : () {
                HapticFeedback.lightImpact();
                onPressed?.call();
              },
        style: ElevatedButton.styleFrom(
          backgroundColor: bg,
          foregroundColor: fg,
          elevation: variant == ButtonVariant.primary ? 2 : 0,
          shadowColor: variant == ButtonVariant.primary
              ? (isDark ? Colors.black.withAlpha(60) : AppColors.lightPrimary.withAlpha(40))
              : Colors.transparent,
          side: border,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.r),
          ),
          padding: EdgeInsets.symmetric(horizontal: 20.w),
        ),
        child: isLoading
            ? SizedBox(
                width: 22.w,
                height: 22.h,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(fg),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (leadingIcon != null) ...[
                    leadingIcon!,
                    SizedBox(width: 8.w),
                  ],
                  Text(
                    text,
                    style: (theme.textTheme.labelLarge ?? AppTypography.labelLarge)
                        .copyWith(
                      color: fg,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (trailingIcon != null) ...[
                    SizedBox(width: 8.w),
                    trailingIcon!,
                  ],
                ],
              ),
      ),
    );
  }
}
