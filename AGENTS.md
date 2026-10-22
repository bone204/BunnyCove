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

### 1. Language Standards
- **User Communication**: Always explain, discuss, plan, and guide the user in clear, professional, structured **Vietnamese** (Tiếng Việt).
- **Source Code**: All code (variables, functions, classes, interfaces, filenames) must be in **English**.
- **Comments & Commits**: All comments (including `TODO`, `FIXME`) and git commit messages must be in **English**. No Vietnamese inside code files.

### 2. Workflow Orchestration
- **Plan First**: For tasks involving 3+ steps or architectural choices, write/update a plan with checklists (`[ ]`, `[/]`, `[x]`) in `tasks/todo.md` and confirm before implementing.
- **Lessons Learned**: Update `tasks/lessons.md` after any correction or feedback from the user.
- **Verification**: Always verify changes before marking tasks complete.

### 3. Mobile Standards (Flutter - `mobile/`)
- Architecture: Feature-based under `lib/features/[feature]/...`.
- State Management: **Cubit** (separate `cubit.dart` and `state.dart`), guard `if (isClosed) return;` before calling `emit()`.
- Navigation: Use `NavigationUtils` with `_buildSlideRoute` in `AppRouter`. Delay before `Navigator.pop()` with `FocusManager.instance.primaryFocus?.unfocus()`.
- UI: Wrap inputs in `GestureDetector` to dismiss keyboard. Use `flutter_screenutil` (`.w`, `.h`, `.sp`). Wrap pages in `SingleChildScrollView`.
- Notifications: Use `CustomSnackBar.show` and `CustomDialog.show`.

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

