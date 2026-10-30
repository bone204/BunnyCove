import 'package:flutter/material.dart';

/// Unified Design Tokens & Color Palette for Bunny Cove
/// Synchronized 1:1 across Flutter Mobile and Next.js Web ("Honey Oak & Sweet Cream")
class AppColors {
  // ==========================================
  // 1. LIGHT MODE TOKENS (Sweet Cream & Honey Oak)
  // ==========================================
  static const Color lightPrimary = Color(0xFFC68B59); // Warm Honey Oak
  static const Color lightPrimaryHover = Color(0xFFB87333); // Deep Honey Oak
  static const Color lightBackground = Color(0xFFFAF7F2); // Sweet Cream Canvas
  static const Color lightSurface = Color(0xFFFFFFFF); // Pure Marshmallow Card
  static const Color lightTextPrimary = Color(0xFF2C221E); // Deep Charcoal Wood
  static const Color lightTextSecondary = Color(0xFF8C7A6B); // Muted Warm Walnut
  static const Color lightBorder = Color(0xFFE6DCCF); // Soft Wood/Cream Border

  // ==========================================
  // 2. DARK MODE TOKENS (Dark Walnut & Amber Glow)
  // ==========================================
  static const Color darkPrimary = Color(0xFFD99B66); // Amber Honey Oak Glow
  static const Color darkBackground = Color(0xFF1F1A17); // Warm Dark Walnut Canvas
  static const Color darkSurface = Color(0xFF2B2420); // Roasted Chestnut Card
  static const Color darkTextPrimary = Color(0xFFF5EFE6); // Warm Cream Text
  static const Color darkTextSecondary = Color(0xFFB3A598); // Soft Muted Hazelnut
  static const Color darkBorder = Color(0xFF382E27); // Dark Wood Grain Border

  // ==========================================
  // 3. FUNCTIONAL FEEDBACK ACCENTS
  // ==========================================
  static const Color success = Color(0xFF4E8752); // Fresh Clover Green (Light)
  static const Color darkSuccess = Color(0xFF62A867); // Mint Clover Green (Dark)
  static const Color warning = Color(0xFFE08E00); // Amber Honey
  static const Color error = Color(0xFFD90429); // Warm Berry Crimson (Light)
  static const Color darkError = Color(0xFFFF5C7A); // Soft Crimson Glow (Dark)

  // ==========================================
  // 4. GAME & MASCOT ACCENTS (Caro & Bingo)
  // ==========================================
  static const Color carrotOrange = Color(0xFFFFA502); // Carrot Piece
  static const Color bowPink = Color(0xFFFF7597); // Bunny Bow Piece
  static const Color bunnyStamp = Color(0xFFFF3366); // Bingo Stamp

  // ==========================================
  // 5. BACKWARDS-COMPATIBLE ALIASES
  // (Maintains 100% stability with existing codebase)
  // ==========================================
  static const Color creamBackground = lightBackground;
  static const Color cardSurface = lightSurface;
  static const Color peachPrimary = lightPrimary;
  static const Color sageSecondary = success;
  static const Color dustyRose = bowPink;
  static const Color deepPlumText = lightTextPrimary;
  static const Color mutedText = lightTextSecondary;
  static const Color borderLight = lightBorder;
}
