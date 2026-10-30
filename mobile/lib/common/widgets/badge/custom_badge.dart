import 'package:bunny_cove_app/common_libs.dart';

enum BadgeVariant { roomCode, ready, rank, neutral }

class CustomBadge extends StatelessWidget {
  final String text;
  final Widget? icon;
  final BadgeVariant variant;
  final VoidCallback? onTap;

  const CustomBadge({
    super.key,
    required this.text,
    this.icon,
    this.variant = BadgeVariant.neutral,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    Color bg;
    Color fg;
    BorderSide border = BorderSide.none;

    switch (variant) {
      case BadgeVariant.roomCode:
        bg = isDark ? AppColors.darkSurface : AppColors.lightBackground;
        fg = theme.colorScheme.primary;
        border = BorderSide(color: theme.colorScheme.primary, width: 1.5);
        break;
      case BadgeVariant.ready:
        bg = isDark ? AppColors.darkSuccess.withAlpha(40) : AppColors.success.withAlpha(30);
        fg = isDark ? AppColors.darkSuccess : AppColors.success;
        border = BorderSide(color: fg, width: 1);
        break;
      case BadgeVariant.rank:
        bg = AppColors.warning.withAlpha(30);
        fg = AppColors.warning;
        border = const BorderSide(color: AppColors.warning, width: 1);
        break;
      case BadgeVariant.neutral:
        bg = isDark ? AppColors.darkSurface : AppColors.lightSurface;
        fg = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;
        border = BorderSide(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        );
        break;
    }

    final content = Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 4.h),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999.r),
        border: border != BorderSide.none ? Border.fromBorderSide(border) : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            icon!,
            SizedBox(width: 4.w),
          ],
          Text(
            text,
            style: (theme.textTheme.labelSmall ?? AppTypography.labelSmall).copyWith(
              color: fg,
              fontWeight: FontWeight.bold,
              letterSpacing: variant == BadgeVariant.roomCode ? 1.5 : 0.5,
            ),
          ),
        ],
      ),
    );

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: content,
      );
    }
    return content;
  }
}
