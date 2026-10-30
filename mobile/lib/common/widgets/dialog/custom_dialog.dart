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
    return showDialog<bool>(
      context: context,
      builder: (context) {
        final l10n = context.l10n;
        final resolvedConfirmText = confirmText ?? l10n.dialogOk;

        return AlertDialog(
          backgroundColor: Theme.of(context).dialogTheme.backgroundColor ?? Theme.of(context).colorScheme.surface,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.r)),
          title: Text(
            title,
            style: (Theme.of(context).textTheme.titleMedium ??
                    AppTypography.titleMedium)
                .copyWith(fontWeight: FontWeight.bold),
          ),
          content: Text(
            message,
            style: Theme.of(context).textTheme.bodyMedium ??
                AppTypography.bodyMedium,
          ),
          actions: [
            if (cancelText != null)
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: Text(
                  cancelText,
                  style: (Theme.of(context).textTheme.labelLarge ??
                          AppTypography.labelLarge)
                      .copyWith(color: Theme.of(context).textTheme.bodySmall?.color),
                ),
              ),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(true),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.r),
                ),
              ),
              child: Text(
                resolvedConfirmText,
                style: (Theme.of(context).textTheme.labelLarge ??
                        AppTypography.labelLarge)
                    .copyWith(color: Colors.white),
              ),
            ),
          ],
        );
      },
    );
  }
}
