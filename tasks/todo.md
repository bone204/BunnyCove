# Bunny Cove - Task Tracking & Implementation Checklist

## Project Status: In Progress (Phase 2: Authentication, Swagger & PostgreSQL)

### Phase 0: Project Setup & Specification

- [x] Create workspace directories (`mobile` and `server`)
- [x] Establish Master Project Rules ([AGENTS.md](../AGENTS.md))
- [x] Establish Master Project Specification & Database Architecture ([general.md](../general.md))
- [x] Integrate Master Rules ([AGENTS.md](../AGENTS.md)) and Specifications ([general.md](../general.md)) into agent context
- [x] Initialize tracking system (`tasks/lessons.md`, `tasks/todo.md`)

---

### Phase 1: Server Foundation & Real-Time Room Gateway (NestJS)

- [x] 1.1 Scaffold NestJS project in `server/` with clean TypeScript setup
- [x] 1.2 Install and configure WebSockets & validation packages
- [x] 1.3 Implement Common Architecture Layer (`response-codes.ts`, `transform.interceptor.ts`, `all-exceptions.filter.ts`)
- [x] 1.4 Implement Real-Time Room Module with generic Pluggable Game Engine architecture (`IGameEngine`, `GameRegistryService`)
- [x] 1.5 Setup Prisma ORM 7 with PostgreSQL schema (`User`, `MatchHistory`, `UserStats`)
- [x] 1.6 Verification & Testing: All automated WebSocket tests passed cleanly

---

### Phase 2: Authentication (JWT Access/Refresh, Login/Logout), Swagger UI & PostgreSQL Setup

- [x] 2.1 Install Dependencies:
  - `@nestjs/swagger`
  - `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`, `@types/bcrypt`, `cookie-parser`, `@types/cookie-parser`, `@prisma/adapter-pg`, `pg`, `@types/pg`
- [x] 2.2 PostgreSQL Setup & Prisma Service:
  - Create `docker-compose.yml` for local PostgreSQL instance (port 5432)
  - Create `src/common/prisma/prisma.service.ts` with PrismaPg adapter & in-memory fallback, plus `prisma.module.ts`
  - Update `prisma/schema.prisma` with `hashedRefreshToken` and generate client
- [x] 2.3 Setup Swagger Documentation:
  - Configure `DocumentBuilder` in `src/main.ts` at `/api/docs` with BearerAuth & custom title
- [x] 2.4 Implement Auth Module (3-Layer Clean Architecture):
  - DTOs: `register.dto.ts`, `login.dto.ts`, `refresh-token.dto.ts` with Swagger decorators (`@ApiProperty`) and `class-validator`
  - Strategy & Guards: `jwt.strategy.ts`, `jwt-auth.guard.ts`
  - `AuthService`: Password hashing via bcrypt, sign short-lived Access Token (15m) & long-lived Refresh Token (7d), token rotation, logout clearing
  - `AuthController`: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
  - Register new response codes in `src/common/constants/response-codes.ts`
- [x] 2.5 Verification & Automated Testing:
  - Compile build (`npm run build`)
  - Run verification script `test/verify-auth-flow.mjs` testing full register -> login -> profile -> refresh -> logout cycle -> All 6 steps passed!
- [x] 2.6 Media & Image Upload Architecture (Cloudinary):
  - Created `UploadModule`, `UploadService`, and `CloudinaryProvider`
  - Added `POST /upload/avatar` (with 400x400 auto-face-crop, WebP, automatic overwrite per user)
  - Added `POST /upload/chat-image` (multiplayer in-room chat ready, 1200px limit, WebP auto-compression)
  - Upgraded Prisma `MessageType` to include `IMAGE`
  - Automated integration test `test/verify-upload-flow.mjs` passed 100%
- [x] 2.7 Email Verification & Password Reset via Gmail (2-minute OTP):
  - [x] Update `prisma/schema.prisma` with `isEmailVerified` and `emailVerifiedAt`
  - [x] Add response codes in `response-codes.ts` and 120s OTP TTL in `defaults.ts`
  - [x] Install `nodemailer` and `@types/nodemailer`
  - [x] Create `EmailModule`, `EmailService` with Gmail SMTP, dev fallback, and Bunny Cove HTML templates
  - [x] Add DTOs: `verify-email.dto.ts`, `resend-verification.dto.ts`, `forgot-password.dto.ts`, `reset-password.dto.ts`
  - [x] Implement `AuthService` methods (`verifyEmail`, `resendVerification`, `forgotPassword`, `resetPassword`) with Redis TTL
  - [x] Add Swagger endpoints in `AuthController`
  - [x] Create automated persistent test suite `server/test/verify-email-flow.mjs` and plug into `verify-all.mjs`
  - [x] Run `npm run test:verify` and verify 100% pass (All 4 test suites passing)
- [x] 2.8 User Profile, Game Statistics & Match History Architecture (`UsersModule`):
  - [x] Create `UsersModule`, `UsersService`, and `UsersController`
  - [x] Implement `GET /users/me`: Personal info, aggregated summary stats (win rate, streaks, points, friends count), and recent matches
  - [x] Implement `PATCH /users/me`: Update display name and custom username (with uniqueness constraint check)
  - [x] Implement `GET /users/me/stats`: Game-by-game statistics and ELO rank breakdown
  - [x] Implement `GET /users/me/matches`: Paginated match history with opponent details
  - [x] Implement `GET /users/:identifier`: Safe public profile lookup without leaking email/credentials
  - [x] Create automated persistent test suite `server/test/verify-profile-flow.mjs` (All 9 steps passed 100%)
  - [x] Register in `server/test/verify-all.mjs` (All 5 test suites passing cleanly)

---

### Upcoming Phases

- [ ] Phase 3: Implement Realtime In-Room Chat & Bunny Stickers on Server
- [ ] Phase 4: Implement Caro (Gomoku) 15x15 Game Engine on Server
- [ ] Phase 5: Implement Bingo 5x5 Game Engine on Server
### Phase 6: Initialize Flutter Client in `mobile/` with Clean Architecture (matching `tour_guide_client`)
- [x] 6.1 Configure Project Manifest & Localization:
  - Create `mobile/l10n.yaml` (arb-dir: `lib/core/config/lang/arb`)
  - Create `mobile/pubspec.yaml` aligned with `tour_guide_client` dependencies
  - Create `mobile/.env` & `mobile/.env.example`
- [x] 6.2 Setup Core Layer (`mobile/lib/core/`):
  - `config/lang/`: `l10n.dart` + `arb/app_en.arb`, `app_vi.arb`, `app_localizations.dart`, `app_localizations_en.dart`, `app_localizations_vi.dart`
  - `config/routes/`: `routes.dart` (`AppRouter.generateRoute`) with `_buildSlideRoute`
  - `config/theme/`: `color.dart` (Pastel palette), `theme.dart`, `typography.dart`
  - `error/`: `failures.dart` (`Failure`, `ServerFailure`, `CacheFailure`, `NetworkFailure`)
  - `network/`: `dio_client.dart` with token interceptor and connection error handling
  - `usecases/`: `usecase.dart` and `no_params.dart`
  - `utils/`: `navigation_utils.dart`
- [x] 6.3 Setup Common Layer (`mobile/lib/common/`):
  - `constants/`: `app_route.constant.dart`, `app_urls.constant.dart`, `app_colors.dart`, `app_default_image.constant.dart`, `response_codes.constant.dart`, `storage_keys.constant.dart`
  - `bloc/`:
    - `lang/`: `locale_cubit.dart` and `locale_state.dart`
    - `auth/`: `auth_state_cubit.dart` and `auth_state.dart`
  - `widgets/`:
    - `dialog/custom_dialog.dart`
    - `snackbar/custom_snackbar.dart`
    - `button/custom_button.dart`
- [x] 6.4 Setup Dependency Injection & Shared Exports:
  - `lib/service_locator.dart`: GetIt setup with SharedPreferences, DioClient, Cubits, Repositories, and UseCases
  - `lib/common_libs.dart`: Consolidated exports
- [x] 6.5 Setup Feature-based Clean Architecture Base (`lib/features/`):
  - `splash/`: `presentation/pages/splash_screen.page.dart` with animated logo and auth-check navigation
  - `auth/`:
    - `data/`: `data_sources/remote/auth_api_service.dart`, `data_sources/local/auth_local_service.dart`, `models/user_model.dart`, `repository/auth_repository_impl.dart`
    - `domain/`: `repository/auth_repository.dart`, `usecases/is_logged_in.dart`, `usecases/sign_in.dart`, `usecases/sign_up.dart`
    - `presentation/`: `bloc/auth_cubit.dart`, `bloc/auth_state.dart`, `pages/sign_in.page.dart`
- [x] 6.6 Setup App Entrypoint (`lib/main.dart`):
  - `runZonedGuarded`, `dotenv`, `setUpServiceLocator`, `ScreenUtilInit`, `MultiBlocProvider`, `MaterialApp` with `AppLocalizations.delegate`
- [x] 6.7 Standardize Response Code Synchronization & Error Localization:
  - [x] Update Project Rules in `AGENTS.md` and `tasks/lessons.md`
  - [x] Sync `ResponseCodesConstant` in `mobile/lib/common/constants/response_codes.constant.dart` 1:1 with BE `ResponseCodes`
  - [x] Add localized error messages into `mobile/lib/core/config/lang/arb/app_en.arb` and `app_vi.arb`
  - [x] Create `ErrorLocalizationExtension` helper in `mobile/lib/core/utils/error_localizer.dart` and export in `common_libs.dart`
  - [x] Update `DioException` handling in `AuthApiService` to map network timeouts to `ResponseCodesConstant.networkError`
  - [x] Update `SignInPage` to display localized errors via `context.getLocalizedError(...)`
  - [x] Run `flutter gen-l10n` and analyze project for verification
- [x] 6.8 Enforce Centralized Typography & Zero Inline TextStyle:
  - [x] Enhance `AppTypography` in `mobile/lib/core/config/theme/typography.dart` with complete Material 3 TextTheme & static accessors
  - [x] Refactor `AppTheme` in `mobile/lib/core/config/theme/theme.dart` to use `AppTypography`
  - [x] Refactor `CustomButton`, `CustomDialog`, and `CustomSnackBar` to use `common_libs.dart` and `Theme.of(context).textTheme`
  - [x] Refactor `SignInPage` and `SplashScreenPage` to use centralized typography instead of inline `TextStyle(...)`
  - [x] Update Typography enforcement in `AGENTS.md`, and `tasks/lessons.md`
  - [x] Verify clean compilation with `flutter analyze`
- [x] 6.9 Enforce Zero Hardcoded Text & Mandatory Localization (l10n):
  - [x] Add all missing UI keys into `app_en.arb` and `app_vi.arb` (sign-in description, validators, welcome message, hints, button labels)
  - [x] Run `flutter gen-l10n` to regenerate localized accessors
  - [x] Add `context.l10n` extension in `mobile/lib/core/config/lang/l10n.dart` and export in `common_libs.dart`
  - [x] Replace all hardcoded strings in `SignInPage`, `SplashScreenPage`, `CustomDialog`, `AppRouter` with `context.l10n`
  - [x] Update `AGENTS.md`, and `tasks/lessons.md` with strict Zero Hardcoded Text rules
  - [x] Verify clean compilation with `flutter analyze`
- [x] 6.10 Codebase Compliance Audit & Quality Enforcement (`/recheck` Skill):
  - [x] Perform exhaustive backend audit in `server/src/`: eliminate plain-string exceptions, enforce `{ code, message }` structured envelope in all controllers/services, fix fallback code in `AllExceptionsFilter`
  - [x] Clean 100% deep relative imports (`../../../../core/`) in `mobile/lib/` to clean package imports (`package:bunny_cove_app/...`), export `Failure`, `UseCase`, `NoParams` via `common_libs.dart`
  - [x] Fix runtime bug in `mobile/lib/main.dart` (registered `AppLocalizations.delegate` and `supportedLocales`)
  - [x] Create comprehensive `/recheck` skill in `.agents/skills/recheck/SKILL.md` with step-by-step verification runbook
  - [x] Verify 100% passing across all gates: `flutter analyze` (0 issues), `npm run lint` (0 warnings/errors), `npm run build`, and `npm run test:verify` (6/6 test suites passed)

---


### Upcoming Phases
- [ ] Phase 3: Implement Realtime In-Room Chat & Bunny Stickers on Server
- [ ] Phase 4: Implement Caro (Gomoku) 15x15 Game Engine on Server
- [ ] Phase 5: Implement Bingo 5x5 Game Engine on Server
- [ ] Phase 7: Connect Flutter Mobile with Server (Room, Games, Chat, Auth)
- [ ] Phase 8: iOS Specific Polish (Haptics, Audio, Slide Transitions)
