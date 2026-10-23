# BUNNY COVE - MANDATORY AGENT DIRECTIVES

> This file is automatically loaded by Antigravity across all sessions and machines.
> Any AI agent operating in this repository must strictly adhere to the project rules and specifications below.

---

## 📖 Single Source of Truth
Before performing any action, architectural decision, or code implementation, you **MUST** read and strictly follow:
1. [rule.md](file:///c:/Bone/Private/Bunny%20Cove/rule.md) - Comprehensive Software Development Bundle (Pawdar Project Rules).
2. [general.md](file:///c:/Bone/Private/Bunny%20Cove/general.md) - Master Project Specification & Database Architecture.

---

## 🚨 Non-Negotiable Core Rules

### 1. Language Standards (Strict & Mandatory)
- **User Communication**: Always explain, discuss, plan, and guide the user in clear, professional, structured **Vietnamese** (Tiếng Việt) in chat responses.
- **Source Code**: All code (variables, functions, classes, interfaces, types, filenames) must be exclusively in **English**.
- **Comments, Docstrings & Env Files**: ALL comments without exception (single-line `//`, multi-line `/* */`, hash `#` in `.env` / `.env.example`, dockerfiles, yaml, JSDoc/docstrings, and `TODO`/`FIXME` tags) must be 100% in **English**. Absolutely NO Vietnamese or non-English characters inside code comments, environment variable descriptions, or configuration files.
- **Git Commits**: All git commit messages must follow Conventional Commits and be strictly in **English**.

### 2. Workflow Orchestration
- **Plan First**: For tasks involving 3+ steps or architectural choices, write/update a plan with checklists (`[ ]`, `[/]`, `[x]`) in `tasks/todo.md` and confirm before implementing.
- **Lessons Learned**: Update `tasks/lessons.md` after any correction or feedback from the user.
- **Verification**: Always verify changes before marking tasks complete.
- **No Auto-Push (Strict User-Triggered Only)**: Never automatically run `git push`. Code must only be staged/committed locally. Remote push is executed ONLY when the user explicitly triggers `/push`, `/push-dev`, or gives an explicit push command.
- **Mandatory Persistent Test Flows**: Every new API or backend feature MUST have an accompanying persistent test script under `server/test/` (e.g. `verify-[feature]-flow.mjs`) and be registered in `server/test/verify-all.mjs` (`npm run test:verify`). Tests must pass 100% before pushing.

### 3. Mobile Standards (Flutter - `mobile/`)
- **Feature-Driven Clean Architecture**:
  - `lib/common_libs.dart`: Centralized barrel export for UI, routing, theme, constants, and widgets. Feature pages must import `common_libs.dart`.
  - `lib/service_locator.dart`: GetIt (`sl`) dependency injection registered in 5 strict layers: External/Core -> DataSources -> Repositories -> UseCases -> Cubits.
  - `lib/common/`: Shared code across features (`bloc/` for app-level state like `auth_state_cubit`, `locale_cubit`; `constants/` for routes, urls, images; `widgets/` for custom buttons, dialogs, snackbars).
  - `lib/core/`: Application infrastructure (`config/routes` with `_buildSlideRoute`, `config/theme` with `AppColors`, `config/lang` with ARB l10n, `error/`, `network/dio_client.dart`, `usecases/`, `utils/navigation_utils.dart`).
  - `lib/features/[feature]/`: Each feature contains `data/` (data_sources, models, repository), `domain/` (entities, repository, usecases), and `presentation/` (bloc/cubit, pages, widgets).
- **State Management**: **Cubit** (separate `cubit.dart` and `state.dart`), always guard with `if (isClosed) return;` before calling `emit()`.
- **Navigation & Routing**: Use `NavigationUtils` with `_buildSlideRoute` in `AppRouter`. Delay before `Navigator.pop()` with `FocusManager.instance.primaryFocus?.unfocus()`.
- **UI & Responsiveness**: Wrap inputs in `GestureDetector` to dismiss keyboard. Use `flutter_screenutil` (`.w`, `.h`, `.sp`). Wrap pages in `SingleChildScrollView`.
- **Dialogs & Alerts**: Always use `CustomSnackBar.show` and `CustomDialog.show`. Never use default ScaffoldMessenger.

### 4. Server Standards (NestJS - `server/`)
- Architecture: 3-Layer Clean Architecture (Controller/Gateway -> Service/UseCase -> Repository).
- Database: **PostgreSQL** with **Prisma ORM** for persistent data; **Redis** for real-time room sessions, active game boards, timers, and Socket.IO adapter.
- Unified Response:
  - Success: `{ "success": true, "code": "STRING_CODE", "data": ... }`
  - Failure: `{ "success": false, "error": { "code": "STRING_CODE", "message": "...", "details": ... } }`
- Validation & Logging: `class-validator` for DTOs; structured JSON logging (Winston/Pino).

### 5. Constants & Zero Hard-coding Standards (Strict)
- **Zero Hard-coded Paths & Defaults**: Absolutely NO hard-coded default URLs, mock/fake assets, CDN paths, fallback image generators, or magic strings in services, controllers, DTOs, or models.
- **Dedicated Constants Folder**: All default URLs, fallback URLs, mock links, response codes, and asset paths MUST reside in dedicated files under `src/common/constants/` (e.g., `defaults.ts`, `response-codes.ts` on server; `lib/common/constants/` on mobile).

---

## 🛠️ Antigravity Customizations Architecture (Rules vs Skills)

To maintain a clean and maintainable codebase, customizations are strictly categorized:
- **Rules (`AGENTS.md` & `rule.md`)**: Always-active behavioral guidelines, coding conventions, architectural patterns, and negative constraints (such as Zero Hard-coding). They apply unconditionally to all coding tasks.
- **Skills (`.agents/skills/`)**: On-demand procedural workflows / runbooks triggered by explicit commands or user intents (e.g., `/compact` in `.agents/skills/compact/SKILL.md`). Skills must NEVER contain coding rules or global constraints.

