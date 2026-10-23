import 'package:flutter/material.dart';

/// Centralized color palette for Bunny Cove.
/// Aesthetic: Cozy Pastel / Neo-Claymorphism.
abstract class AppColors {
  // Canvas & Background
  static const Color background = Color(0xFFFFFDF9);
  static const Color surface = Color(0xFFF7EFE9);
  static const Color surfaceMuted = Color(0xFFEFE5DC);
  static const Color surfaceCard = Color(0xFFFFFFFF);

  // Brand Accents
  static const Color primary = Color(0xFFFFB7A1); // Pastel Peach Orange
  static const Color primaryLight = Color(0xFFFFD9CE);
  static const Color primaryDark = Color(0xFFE08E77);

  static const Color secondary = Color(0xFFA7C4B5); // Sage Green
  static const Color secondaryLight = Color(0xFFD2E3DB);
  static const Color secondaryDark = Color(0xFF7A9E8D);

  static const Color tertiary = Color(0xFFD4A5A5); // Dusty Rose
  static const Color tertiaryLight = Color(0xFFE8C8C8);
  static const Color tertiaryDark = Color(0xFFB37B7B);

  // Typography (Strictly no pure black)
  static const Color textPrimary = Color(0xFF4A3E3D); // Deep Plum Espresso
  static const Color textSecondary = Color(0xFF7D706F);
  static const Color textMuted = Color(0xFFA89F9E);
  static const Color textLight = Color(0xFFFFFDF9);

  // Borders & Dividers
  static const Color border = Color(0xFFEADBD1);
  static const Color borderSubtle = Color(0xFFF0E5DC);

  // System States
  static const Color success = Color(0xFF72B095);
  static const Color warning = Color(0xFFF4BE77);
  static const Color error = Color(0xFFE87A7A);
  static const Color info = Color(0xFF8BB8E8);

  // Tactile Shadows
  static const Color shadow = Color(0x1A4A3E3D);
  static const Color shadowLight = Color(0x0D4A3E3D);
}
