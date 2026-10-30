# BUNNY COVE - MASTER PROJECT DIRECTIVES & RULES

> **Single Source of Truth**: This file is automatically discovered and loaded by Antigravity across all sessions, windows, and machines.
> Any AI agent operating in this repository MUST strictly follow the directives below.

---

## 📚 Documentation Architecture

To eliminate file bloat and prevent rule conflicts, project documentation is strictly separated:
1. **`AGENTS.md` (This File)**: The **sole, definitive master rules file** for all engineering standards, coding conventions, and architectural constraints.
2. **`general.md`**: Master Project Architecture, Database Schema, and Pluggable Game Engine Specifications.
3. **`design-style.md`**: UI/UX Visual Identity, Design Tokens, Color Palette, and Aesthetic Guidelines.
4. **`tasks/`**: Real-time project tracking (`todo.md`) and persistent developer lessons (`lessons.md`).

---

## 📌 PART I: COMMON ENGINEERING DIRECTIVES

### 1. Language & Communication Standards (Strict & Non-Negotiable)
- **User Communication**: Always explain, discuss, plan, and guide the user in clear, professional, structured **Vietnamese** (Tiếng Việt) in chat responses.
- **Source Code**: All code (variables, functions, classes, interfaces, types, filenames) must be exclusively in **English**.
- **Comments, Docstrings & Env Files**: ALL comments without exception (single-line `//`, multi-line `/* */`, hash `#` in `.env` / `.env.example`, dockerfiles, yaml, JSDoc/docstrings, and `TODO`/`FIXME` tags) must be 100% in **English**. Absolutely NO Vietnamese or non-English characters inside code comments, environment variable descriptions, or configuration files.
- **Git Commits**: All git commit messages must follow Conventional Commits and be strictly in **English**.

### 2. Workflow Orchestration
- **Plan First**: For tasks involving 3+ steps or architectural choices, write/update a plan with checklists (`[ ]`, `[/]`, `[x]`) in `tasks/todo.md` and confirm before implementing.
- **Lessons Learned**: Update `tasks/lessons.md` after any correction or feedback from the user.
- **Verification**: Always verify changes (`flutter analyze`, backend tests) before marking tasks complete.
- **Strict No Auto-Push Protocol**: Never automatically run `git push`. Code must only be staged/committed locally. Remote push is executed ONLY when the user explicitly triggers `/push`, `/push-dev`, or gives an explicit push command.

### 3. Response Code Synchronization & Error Localization
- Every backend response/error code created in `server/src/common/constants/response-codes.ts` MUST be synchronously added to:
  - Mobile: `mobile/lib/common/constants/response_codes.constant.dart`
  - Localization files: `mobile/lib/core/config/lang/arb/app_en.arb` and `app_vi.arb`
- **Error Display Principle**: Backend `error.message` is strictly for debugging/logging. The client UI must NEVER render raw server error strings to end users. Frontend must resolve `error.code` to localized text via `context.getLocalizedError(code)`.

### 4. Zero Hard-coding Standards (Strict)
- Absolutely NO hard-coded default URLs, mock/fake assets, CDN paths, fallback image generators, or magic strings in services, controllers, DTOs, or models.
- All default values and paths MUST reside in dedicated constants files:
  - Server: `server/src/common/constants/defaults.ts`
  - Mobile: `mobile/lib/common/constants/`

---

## 📱 PART II: FLUTTER MOBILE DIRECTIVES (`mobile/`)

### 1. Feature-Driven Clean Architecture
- **Centralized Barrel Export (`lib/common_libs.dart`)**:
  - Centralized barrel export for UI, routing, theme, typography, constants, navigation, utilities, and widgets.
  - All feature pages, widgets, dialogs, snackbars, and services MUST import `package:bunny_cove_app/common_libs.dart`.
  - Absolutely NO direct relative imports to individual constant files or widgets.
- **Service Locator (`lib/service_locator.dart`)**:
  - GetIt (`sl`) registered in 5 strict layers: External/Core -> DataSources -> Repositories -> UseCases -> Cubits.
- **Project Structure**:
  - `lib/core/`: Application infrastructure (network `dio_client.dart`, routing `routes.dart`, theme `AppColors`/`AppTheme`/`AppTypography`, localization `l10n.dart`).
  - `lib/common/`: Shared code across features (`bloc/`, `constants/`, `widgets/`).
  - `lib/features/[feature]/`: Sliced into `data/`, `domain/`, and `presentation/`.

### 2. Zero Hardcoded User-Facing Text & Mandatory Localization (`l10n`)
- Absolutely NO hardcoded user-facing string literals in UI widgets, pages, buttons, snackbars, dialogs, form validators, or router fallback views.
- ALL text displayed to the user MUST be declared in ARB localization files (`lib/core/config/lang/arb/app_en.arb` and `app_vi.arb`) and consumed exclusively via `context.l10n.[key]` (exported via `common_libs.dart`).
- Parameterized strings MUST define ARB placeholders (e.g. `welcomeBack(displayName)`, `noRouteDefined(routeName)`).
- Backend error codes MUST be resolved using `context.getLocalizedError(code)`.

### 3. Strict Zero Inline TextStyle & Centralized Typography
- Absolutely NO inline `TextStyle(...)` instantiated directly inside UI widgets, pages, snackbars, or dialogs.
- All text MUST strictly consume the centralized typography hierarchy via `Theme.of(context).textTheme.[role]` or static getters on `AppTypography.[role]` (exported via `common_libs.dart`).
- Text styling modifications (e.g. custom color or weight) must exclusively be applied via `.copyWith(...)` on existing theme styles.
- Do NOT override font sizes arbitrarily; all typography roles and sizes are defined centrally in `AppTypography`.

### 4. UI, Layout & Responsiveness
- Wrap input screens in `GestureDetector(onTap: () => FocusScope.of(context).unfocus())` to dismiss keyboard on tap outside.
- Use `flutter_screenutil` (`.w`, `.h`, `.sp`, `.r`) for all responsive dimensions.
- Wrap pages in `SingleChildScrollView` to prevent keyboard overflow issues.

### 5. State Management & Navigation
- State Management: **Cubit** only (separate `cubit.dart` and `state.dart`), always guard with `if (isClosed) return;` before calling `emit()`.
- Navigation: Use `NavigationUtils` with `_buildSlideRoute` in `AppRouter`. Delay before `Navigator.pop()` with `FocusManager.instance.primaryFocus?.unfocus()`.
- Dialogs & Alerts: Always use `CustomSnackBar.show` and `CustomDialog.show`. Never instantiate default `ScaffoldMessenger` or raw `AlertDialog`.

---

## 🖥️ PART III: SERVER BACKEND DIRECTIVES (`server/`)

### 1. 3-Layer Clean Architecture
- Controller/Gateway -> Service/UseCase -> Repository/Prisma.
- Gateways for real-time WebSockets (Socket.IO with Redis adapter); Controllers for HTTP REST endpoints.

### 2. Database & Cache Standards
- **PostgreSQL**: Managed via Prisma ORM 7 (`@prisma/adapter-pg` + `pg`, configured in `prisma.config.ts`).
- **Redis**: Cloud serverless Redis via Upstash REST (`@upstash/redis` over HTTPS port 443) or local Redis.
- **Scalable Multiplayer Schema**: Never hardcode player slots in matches. Use junction `MatchParticipant` with `seatIndex`, `score`, `rank`, and `isWinner`.

### 3. Unified API Response Envelope
- Success: `{ "success": true, "code": "STRING_CODE", "data": ... }`
- Failure: `{ "success": false, "error": { "code": "STRING_CODE", "message": "...", "details": ... } }`

### 4. Mandatory Persistent Test Flows
- Every new API or backend feature MUST have an accompanying persistent test script under `server/test/` (e.g. `verify-[feature]-flow.mjs`) and be registered in `server/test/verify-all.mjs` (`npm run test:verify`).
- Tests must pass 100% before committing or marking tasks complete.

---

## 🛠️ PART IV: ANTIGRAVITY CUSTOMIZATIONS ARCHITECTURE (RULES VS SKILLS)

- **Rules (`AGENTS.md`)**: Always-active behavioral guidelines, coding conventions, architectural patterns, and negative constraints. They apply unconditionally to all coding tasks.
- **Skills (`.agents/skills/`)**: On-demand procedural workflows / runbooks triggered by explicit commands or user intents (e.g., `/compact`, `/push`, `/push-dev`). Skills must NEVER contain coding rules or global constraints.
