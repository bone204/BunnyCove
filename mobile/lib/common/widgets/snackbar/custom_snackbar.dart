import 'package:bunny_cove_app/common_libs.dart';

enum SnackBarType { success, error, warning, info }

class CustomSnackBar {
  static void show(
    BuildContext context, {
    required String message,
    SnackBarType type = SnackBarType.info,
    Duration duration = const Duration(seconds: 3),
  }) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    Color backgroundColor;
    Color textColor = Colors.white;
    IconData icon;

    switch (type) {
      case SnackBarType.success:
        backgroundColor = isDark ? AppColors.darkSuccess : AppColors.success;
        icon = Icons.check_circle_rounded;
        break;
      case SnackBarType.error:
        backgroundColor = isDark ? AppColors.darkError : AppColors.error;
        icon = Icons.error_rounded;
        break;
      case SnackBarType.warning:
        backgroundColor = AppColors.warning;
        icon = Icons.warning_rounded;
        break;
      case SnackBarType.info:
        backgroundColor = isDark ? AppColors.darkPrimary : AppColors.lightPrimary;
        textColor = isDark ? theme.scaffoldBackgroundColor : Colors.white;
        icon = Icons.info_rounded;
        break;
    }

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
        elevation: 4,
        margin: EdgeInsets.symmetric(horizontal: 20.w, vertical: 16.h),
        duration: duration,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.r),
        ),
        content: Row(
          children: [
            Icon(icon, color: textColor, size: 22.r),
            SizedBox(width: 12.w),
            Expanded(
              child: Text(
                message,
                style: (theme.textTheme.bodyMedium ?? AppTypography.bodyMedium)
                    .copyWith(
                  color: textColor,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
