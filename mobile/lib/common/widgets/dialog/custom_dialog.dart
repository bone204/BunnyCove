import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../constants/app_colors.dart';

enum DialogType { success, error, warning, info }

/// Reusable dialog adhering to Cozy Pastel aesthetics.
class CustomDialog extends StatelessWidget {
  final String? title;
  final String? content;
  final DialogType type;
  final List<Widget>? actions;
  final Widget? contentWidget;

  const CustomDialog({
    super.key,
    this.title,
    this.content,
    this.type = DialogType.info,
    this.actions,
    this.contentWidget,
  });

  static Future<T?> show<T>(
    BuildContext context, {
    String? title,
    String? content,
    DialogType type = DialogType.info,
    List<Widget>? actions,
    Widget? contentWidget,
    bool barrierDismissible = true,
  }) {
    return showDialog<T>(
      context: context,
      barrierDismissible: barrierDismissible,
      builder: (context) => CustomDialog(
        title: title,
        content: content,
        type: type,
        actions: actions,
        contentWidget: contentWidget,
      ),
    );
  }

  IconData _getIcon() {
    switch (type) {
      case DialogType.success:
        return Icons.check_circle_rounded;
      case DialogType.error:
        return Icons.error_rounded;
      case DialogType.warning:
        return Icons.warning_rounded;
      case DialogType.info:
        return Icons.info_rounded;
    }
  }

  Color _getColor() {
    switch (type) {
      case DialogType.success:
        return AppColors.success;
      case DialogType.error:
        return AppColors.error;
      case DialogType.warning:
        return AppColors.warning;
      case DialogType.info:
        return AppColors.info;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getColor();

    return Dialog(
      backgroundColor: AppColors.surfaceCard,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(28.r),
        side: const BorderSide(color: AppColors.border, width: 1),
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 24.h),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: EdgeInsets.all(16.w),
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(_getIcon(), color: color, size: 40.sp),
            ),
            SizedBox(height: 16.h),
            if (title != null) ...[
              Text(
                title!,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 8.h),
            ],
            if (content != null)
              Text(
                content!,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                textAlign: TextAlign.center,
              ),
            if (contentWidget != null) contentWidget!,
            SizedBox(height: 20.h),
            if (actions != null)
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: actions!,
              )
            else
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('OK'),
              ),
          ],
        ),
      ),
    );
  }
}
