import 'package:bunny_cove_app/common_libs.dart';

enum DialogType { info, warning, error, confirm }

class CustomDialog {
  static Future<bool?> show(
    BuildContext context, {
    required String title,
    required String message,
    DialogType type = DialogType.info,
    String? confirmText,
    String? cancelText,
  }) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final l10n = context.l10n;
    final resolvedConfirmText = confirmText ?? l10n.dialogOk;

    IconData headerIcon;
    Color iconColor;

    switch (type) {
      case DialogType.info:
        headerIcon = Icons.info_outline_rounded;
        iconColor = theme.colorScheme.primary;
        break;
      case DialogType.warning:
        headerIcon = Icons.warning_amber_rounded;
        iconColor = AppColors.warning;
        break;
      case DialogType.error:
        headerIcon = Icons.error_outline_rounded;
        iconColor = isDark ? AppColors.darkError : AppColors.error;
        break;
      case DialogType.confirm:
        headerIcon = Icons.help_outline_rounded;
        iconColor = theme.colorScheme.primary;
        break;
    }

    return showDialog<bool>(
      context: context,
      barrierColor: Colors.black.withAlpha(120),
      builder: (context) {
        return AlertDialog(
          backgroundColor: theme.dialogTheme.backgroundColor ?? theme.colorScheme.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24.r),
            side: BorderSide(
              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
              width: 1,
            ),
          ),
          title: Row(
            children: [
              Icon(headerIcon, color: iconColor, size: 28.r),
              SizedBox(width: 10.w),
              Expanded(
                child: Text(
                  title,
                  style: (theme.textTheme.titleMedium ?? AppTypography.titleMedium)
                      .copyWith(
                    fontWeight: FontWeight.bold,
                    color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                  ),
                ),
              ),
            ],
          ),
          content: Text(
            message,
            style: (theme.textTheme.bodyMedium ?? AppTypography.bodyMedium).copyWith(
              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
              height: 1.4,
            ),
          ),
          actionsPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
          actions: [
            if (cancelText != null)
              CustomButton(
                text: cancelText,
                variant: ButtonVariant.ghost,
                width: 100.w,
                height: 44.h,
                onPressed: () => Navigator.of(context).pop(false),
              ),
            CustomButton(
              text: resolvedConfirmText,
              variant: type == DialogType.error ? ButtonVariant.danger : ButtonVariant.primary,
              width: cancelText != null ? 120.w : double.infinity,
              height: 44.h,
              onPressed: () => Navigator.of(context).pop(true),
            ),
          ],
        );
      },
    );
  }
}
