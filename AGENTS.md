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
  - Web: `web/src/infrastructure/constants/response-codes.ts` and locales dictionaries
- **Error Display Principle**: Backend `error.message` is strictly for debugging/logging. The client UI must NEVER render raw server error strings to end users. Frontend must resolve `error.code` to localized text via localized helpers / context.

### 4. Zero Hard-coding Standards (Strict)
- Absolutely NO hard-coded default URLs, mock/fake assets, CDN paths, fallback image generators, or magic strings in services, controllers, DTOs, or models.
- All default values and paths MUST reside in dedicated constants files:
  - Server: `server/src/common/constants/defaults.ts`
  - Mobile: `mobile/lib/common/constants/`
  - Web: `web/src/infrastructure/constants/`

### 5. Cross-Platform Shared UI Component Standards (Web & Mobile 1:1 Parity)
- **Zero-Tolerance Component Discrepancy**: All common UI components (Buttons, Cards, Inputs, Dialogs, Snackbars/Toasts, Badges/Pills, Avatars) MUST strictly share identical geometry, border-radius tokens, border widths, elevation shadows, typography roles, and interactive states between Flutter Mobile and Next.js Web as specified in `design-style.md`:
  - **Buttons**: Border-radius `16px` (`16.r` / `rounded-2xl`), height `50px - 52px` (`52.h` / `h-13`), bold/semi-bold typography, consistent variant styling (Primary, Secondary Outline, Ghost, Danger), active scale transition & haptics.
  - **Cards & Containers**: Border-radius `20px` (`20.r` / `rounded-3xl`), `1px solid var(--border)`, soft warm drop-shadow, dynamic surface background.
  - **Input Fields**: Border-radius `14px` (`14.r` / `rounded-xl`), height `50px` (`50.h` / `h-12`), `1px` idle border ➔ `2px` focus border in Primary with subtle glow ring.
  - **Dialogs & Modals**: Border-radius `24px` (`24.r` / `rounded-3xl`), backdrop-blur glassmorphism overlay, mascot header icon.
  - **Snackbars & Toasts**: Floating pill shape (`16.r` / `rounded-2xl`), floating elevation, leading status icons (`success`, `error`, `warning`, `info`).
  - **Badges & Pills**: Capsule shape (`999px` / `rounded-full`), padding `12px` horizontal, `4px` vertical (`px-3 py-1`).
  - **Interaction**: Web must enforce `cursor-pointer` and `select-none` on all clickable components; Mobile must trigger `HapticFeedback.lightImpact()` on button taps.

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

### 6. Light/Dark Theme Setup (Mandatory 2 Themes)
- **Unified Visual Identity**: Mobile must synchronize 1:1 with Web using the shared "Honey Oak & Sweet Cream" design tokens defined in `design-style.md` and `AppColors`.
- **Implementation**:
  - Implement full support for both `AppTheme.lightTheme` and `AppTheme.darkTheme`.
  - State managed via `ThemeCubit` (`mobile/lib/common/bloc/theme/theme_cubit.dart`) with `ThemeMode.system`, `ThemeMode.light`, and `ThemeMode.dark` persisted in `SharedPreferences`.
  - All UI widgets, pages, buttons, dialogs, and text fields must strictly consume dynamic colors via `Theme.of(context).colorScheme`, `Theme.of(context).scaffoldBackgroundColor`, or theme-adaptive getters rather than hardcoding static light colors, ensuring seamless real-time theme toggling without visual glitches.


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

## 🌐 PART IV: NEXT.JS / REACT WEB DIRECTIVES (`web/`)

### 1. Light/Dark Theme Setup
- **Mandatory Configuration**: Every web project must centralize Light/Dark theme toggling from the beginning.
- **Implementation**:
  - Use a global `ThemeProvider` to manage theme states and synchronize them with the HTML class (or `data-theme` attribute).
  - Provide an easily accessible `ThemeToggle` button on the header or sidebar.
  - Sync colors dynamically via Tailwind CSS variables (or standard CSS variables) for smooth transition effects.

### 2. 3-Layer Clean Architecture & App Router Composition
Source code must be strictly organized into layers under `src/`:
- **Domain Layer (`src/domain`)**:
  - `src/domain/entities`: Contains pure data definitions (Entities/Types).
  - `src/domain/repositories`: Contains Interfaces for Repositories (e.g., `AuthRepository`).
  - `src/domain/usecases`: Contains single-purpose Use Case classes.
  - *Rule*: Independent of network libraries, frameworks, or external APIs.
- **Application Layer (`src/application`)**:
  - `src/application/dto`: Contains Data Transfer Objects for data serialization/transmission.
  - `src/application/mappers`: Contains mappers to map data between layers.
  - `src/application/services`: Contains intermediate services coordinating data flow.
- **Infrastructure Layer (`src/infrastructure`)**:
  - `src/infrastructure/repositories`: Implements Repository Interfaces from the Domain layer (e.g., `RtkAuthRepository`).
  - `src/infrastructure/rtk` or similar: Sets up global state (Redux Toolkit/Zustand) and API configuration.
  - `src/infrastructure/http`: Base HTTP client wrappers (Axios/Fetch).
  - `src/infrastructure/api`: Declares endpoints and handles system API integrations.
- **Presentation Layer (`src/presentation`)**: UI components and view-only logic:
  - `pages/`: Contains major page-level components (typically using `"use client"`).
  - `components/`: Contains smaller reusable UI components.
  - `hooks/`: Custom hooks for UI logic or global state interactions (e.g., `useAuthState`).
  - `providers/`: Contains wrapper configurations (`ThemeProvider`, `ReduxProvider`, `QueryClientProvider`, etc.).
- **Thin Entrypoint App Router (`src/app`)**:
  - *Rule*: Files named `page.tsx` under `src/app` must be extremely thin. Their sole purpose is to parse server-side parameters (`searchParams`, `params`) and pass them directly to the corresponding Page Component of the Presentation layer. No UI logic or direct API queries are allowed here.

### 3. State Management & Data Fetching
- **Global State**: Use Redux Toolkit or Zustand as the single source of truth for application state.
- **API Queries**: Fetch data using libraries with built-in caching (RTK Query / React Query).
- **Repository Pattern**: All API calls must be wrapped inside Repository implementations to decouple the UI from the network client.
- **Error Handling**: Use centralized helpers to parse API errors into unified domain-specific errors.

### 4. UI & Styling Standards
- **Tailwind CSS**: Use Tailwind for styling. Declare variables for colors and effects in the global stylesheet and apply them uniformly via utility classes.
- **Design Tokens & Font Consistency**: Any new UI components or pages created must strictly adhere to the established "Honey Oak & Sweet Cream" wood theme CSS variables defined in `globals.css` (e.g. `var(--primary)`, `var(--background)`, `var(--foreground)`, `var(--border)`, `var(--success)`) and must use the configured Merriweather serif font (`var(--font-merriweather)`). Do not hardcode arbitrary color hexes, default Tailwind colors (e.g. indigo, blue, emerald), or default Geist/sans-serif fonts, to prevent style and font mismatches.
- **i18n (Multi-Language)**: Never hardcode strings directly in the UI. Use locales files and import translations dynamically via the localization hook.
- **Form Validation**: Use React Hook Form with Zod (or equivalent schemas) for robust input validation and clean error styling.
- **Section Layout Standard**: Any section created in the layout must use the standard Tailwind container utility class with appropriate padding (e.g., `container mx-auto px-4` or `px-6`) to keep the content aligned, unified, and fully responsive.
- **Card & Shadow Standards**: All cards must strictly adhere to the predefined shadow styles defined in the global design token/theme settings. Do not apply arbitrary, inline shadow values.
- **Comprehensive Responsive Optimization**: When adding any new UI component, it must be thoroughly optimized, clean, and responsive across all three layout form factors: Mobile, Tablet, and Web. Use Tailwind breakpoints carefully to ensure layout perfection without overflow on any screen resolution.
- **Interactive Pointer & Text Selection**: Any clickable or interactive element (buttons, links, toggles, tabs, icons, and custom interactive nodes) must have the `cursor-pointer` utility class applied to ensure a clear visual affordance. Additionally, all created UI elements (headers, layout containers, cards, icons, list items, and interactive nodes) must utilize the `select-none` class to ensure a high-end, native-like user experience by preventing accidental text highlight selections during interactions.

---

## 🛠️ PART V: ANTIGRAVITY CUSTOMIZATIONS ARCHITECTURE (RULES VS SKILLS)

- **Rules (`AGENTS.md`)**: Always-active behavioral guidelines, coding conventions, architectural patterns, and negative constraints. They apply unconditionally to all coding tasks.
- **Skills (`.agents/skills/`)**: On-demand procedural workflows / runbooks triggered by explicit commands or user intents (e.g., `/compact`, `/push`, `/push-dev`). Skills must NEVER contain coding rules or global constraints.
