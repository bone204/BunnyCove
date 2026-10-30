/// Consolidate imports that are common across the app.
library;

// Flutter & UI
export 'package:flutter/material.dart';
export 'package:flutter_screenutil/flutter_screenutil.dart';

// Localization
export 'package:bunny_cove_app/core/config/lang/l10n.dart';
export 'package:bunny_cove_app/core/config/lang/arb/app_localizations.dart';

// Configurations
export 'package:bunny_cove_app/core/config/routes/routes.dart';
export 'package:bunny_cove_app/core/config/theme/color.dart';
export 'package:bunny_cove_app/core/config/theme/theme.dart';
export 'package:bunny_cove_app/core/config/theme/typography.dart';

// Constants
export 'package:bunny_cove_app/common/constants/app_route.constant.dart';
export 'package:bunny_cove_app/common/constants/app_urls.constant.dart';
export 'package:bunny_cove_app/common/constants/app_default_image.constant.dart';
export 'package:bunny_cove_app/common/constants/storage_keys.constant.dart';
export 'package:bunny_cove_app/common/constants/response_codes.constant.dart';

// Utilities & Widgets
export 'package:bunny_cove_app/core/utils/navigation_utils.dart';
export 'package:bunny_cove_app/core/utils/error_localizer.dart';
export 'package:bunny_cove_app/common/widgets/snackbar/custom_snackbar.dart';
export 'package:bunny_cove_app/common/widgets/dialog/custom_dialog.dart';
export 'package:bunny_cove_app/common/widgets/button/custom_button.dart';

// Error & Use Cases
export 'package:bunny_cove_app/core/error/failures.dart';
export 'package:bunny_cove_app/core/usecases/usecase.dart';
export 'package:bunny_cove_app/core/usecases/no_params.dart';
