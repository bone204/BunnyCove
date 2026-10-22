# Bunny Cove - Task Tracking & Implementation Checklist

## Project Status: In Progress (Phase 2: Authentication, Swagger & PostgreSQL)

### Phase 0: Project Setup & Specification
- [x] Create workspace directories (`mobile` and `server`)
- [x] Establish Master Project Rules ([rule.md](../rule.md))
- [x] Establish Master Project Specification & Database Architecture ([general.md](../general.md))
- [x] Integrate Master Rules ([rule.md](../rule.md)) and Specifications ([general.md](../general.md)) into agent context
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
- [ ] Phase 6: Initialize Flutter Client in `mobile/` with Cozy Pastel Theme & ScreenUtil
- [ ] Phase 7: Connect Flutter Mobile with Server (Room, Games, Chat, Auth)
- [ ] Phase 8: iOS Specific Polish (Haptics, Audio, Slide Transitions)
