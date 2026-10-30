---
name: recheck
description: >-
  Triggered when the user types "/recheck" or requests a deep audit to verify whether any
  generated, updated, or existing code violates the master project directives, Clean Architecture,
  or zero-tolerance standards in AGENTS.md.
---

# Codebase Compliance & Quality Audit Skill (`/recheck`)

Use this skill whenever the user types `/recheck` or requests a thorough audit to verify whether recent or existing code strictly adheres to the master directives in [AGENTS.md](file:///c:/Bone/Private/Bunny%20Cove/AGENTS.md).

---

## 🎯 Verification Objectives & Zero-Tolerance Gates

1. **Language & Localization**:
   - Comments & Code: 100% English. Absolutely NO Vietnamese in code comments or docstrings.
   - User Communication: Professional Vietnamese in chat responses.
   - Flutter UI: Zero hardcoded strings. Must use `context.l10n.[key]`.
2. **Typography & Styling**:
   - Flutter: Zero inline `TextStyle(...)`. Must consume `AppTypography` or `Theme.of(context).textTheme`.
3. **Architecture & Imports**:
   - Flutter: All feature imports must use `package:bunny_cove_app/common_libs.dart`. No direct relative imports to shared constants/widgets.
   - Server: Strict 3-layer Clean Architecture (Controller -> Service -> Repository/Prisma).
4. **Error Handling & Response Envelope**:
   - Server: All exceptions must use `{ code: ResponseCodes.xxx, message: '...' }`. No plain-string exceptions.
   - Response codes must be synchronized across server, mobile constant, and localization files.
   - Flutter: Error display must resolve `error.code` via `context.getLocalizedError(code)`. Never display raw server error message to end users.
5. **State Management & UI Safety**:
   - Flutter: Cubits must guard with `if (isClosed) return;` before calling `emit()`.
   - Dialogs & SnackBars: Must use `CustomSnackBar.show` and `CustomDialog.show`. No raw `ScaffoldMessenger` or `AlertDialog`.
6. **Automation Gates**:
   - `flutter analyze` must pass with 0 errors and 0 warnings.
   - `npm run lint` and `npm run build` in `server/` must pass with 0 errors.
   - `npm run test:verify` in `server/` must pass 100%.

---

## 🛠️ Step-by-Step Audit Runbook

### Step 1: Mobile Compliance Audit (`mobile/lib/`)

Run PowerShell / shell commands to check for violations:

```powershell
# 1.1 Check for unauthorized inline TextStyle (only allowed in app_typography.dart)
Get-ChildItem -Path "mobile/lib" -Recurse -Filter "*.dart" |
  Where-Object { $_.FullName -notmatch "app_typography\.dart" } |
  Select-String -Pattern "TextStyle\("

# 1.2 Check for relative imports to common/core folders instead of common_libs.dart
Get-ChildItem -Path "mobile/lib" -Recurse -Filter "*.dart" |
  Where-Object { $_.FullName -notmatch "common_libs\.dart" } |
  Select-String -Pattern "import\s+['\"]\.\./.*(constants|widgets|core)/"

# 1.3 Check for raw ScaffoldMessenger or AlertDialog
Get-ChildItem -Path "mobile/lib" -Recurse -Filter "*.dart" |
  Select-String -Pattern "ScaffoldMessenger\.of|showDialog\(|AlertDialog\("

# 1.4 Check Cubit emit calls without isClosed guard
Get-ChildItem -Path "mobile/lib" -Recurse -Filter "*cubit*.dart" |
  Select-String -Pattern "emit\("

# 1.5 Run Flutter static analysis
cd mobile
flutter analyze
```

### Step 2: Backend Compliance Audit (`server/src/`)

```powershell
# 2.1 Check for plain-string NestJS exceptions without structured code
Get-ChildItem -Path "server/src" -Recurse -Filter "*.ts" |
  Select-String -Pattern "throw new \w+Exception\(['\`\"]"

# 2.2 Check for hardcoded localhost URLs outside defaults/configuration
Get-ChildItem -Path "server/src" -Recurse -Filter "*.ts" |
  Where-Object { $_.FullName -notmatch "defaults\.ts" } |
  Select-String -Pattern "https?://localhost"

# 2.3 Check for non-English comments in TypeScript and Dart files
Get-ChildItem -Path "server/src", "mobile/lib" -Recurse -Include "*.ts", "*.dart" |
  Select-String -Pattern "//.*[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]"

# 2.4 Verify backend build & lint
cd server
npm run lint
npm run build

# 2.5 Run full persistent verification suite
npm run test:verify
```

### Step 3: Response Codes Synchronization Audit

Verify that any code in `server/src/common/constants/response-codes.ts` also exists in:
- `mobile/lib/common/constants/response_codes.constant.dart`
- `mobile/lib/core/config/lang/arb/app_en.arb`
- `mobile/lib/core/config/lang/arb/app_vi.arb`
- `mobile/lib/core/utils/error_localizer.dart`

---

## 📊 Output Audit Report Format

When `/recheck` completes, present the findings in clear, professional Vietnamese:

1. **Bảng Tổng Hợp Kiểm Tra (Audit Checklist Table)**:
   | Tiêu Chí Kiểm Tra (Rule Check) | Trạng Thái | Chi Tiết / Số Lượng Vi Phạm |
   | :--- | :---: | :--- |
   | Mobile: Zero Inline TextStyle | ✅ PASS / ❌ FAIL | ... |
   | Mobile: Zero Hardcoded UI Text (l10n) | ✅ PASS / ❌ FAIL | ... |
   | Mobile: Centralized Barrel `common_libs.dart` | ✅ PASS / ❌ FAIL | ... |
   | Mobile: Cubit `isClosed` Guard | ✅ PASS / ❌ FAIL | ... |
   | Mobile: `flutter analyze` | ✅ PASS / ❌ FAIL | 0 errors, 0 warnings |
   | Server: Structured Exception Envelope | ✅ PASS / ❌ FAIL | 100% exceptions có `{ code, message }` |
   | Server: Zero Non-English Comments | ✅ PASS / ❌ FAIL | ... |
   | Server: Response Codes Synchronization | ✅ PASS / ❌ FAIL | Đồng bộ hoàn toàn |
   | Server: `npm run lint` & `npm run build` | ✅ PASS / ❌ FAIL | ... |
   | Server: `npm run test:verify` | ✅ PASS / ❌ FAIL | 100% Suites Passed |

2. **Hành Động Khắc Phục (Auto-Remediation)**:
   - Nếu phát hiện bất kỳ lỗi nào, agent tự động tiến hành sửa chữa mã nguồn ngay lập tức.
   - Chạy lại các bài test tương ứng để bảo đảm 100% PASS trước khi kết thúc báo cáo.

