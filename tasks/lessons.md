# Lessons Learned - Bunny Cove Project

## General & Workflow Lessons
- **User Instruction Precision**: When the user requests to initialize folder bases without code, keep the directories clean and empty until explicitly instructed to start implementation. Do not scaffold boilerplate with premature feature logic.
- **Naming Conventions**: Directory names are strictly `mobile` (Flutter) and `server` (NestJS).
- **Communication Language**: All communications, explanations, roadmaps, and plan discussions must be in clear, structured Vietnamese. All source code, comments, and commit messages must be in English.
- **Rules & Specs**: Always follow [rule.md](../rule.md) and [general.md](../general.md) as the single source of truth for architectural and coding standards.
- **No Extraneous Agent Folders**: Do not generate `.agents` directories or `AGENTS.md` files in the workspace. The project rules in [rule.md](../rule.md) and specifications in [general.md](../general.md) are directly read and strictly adhered to by the assistant.
- **Extensible Game Architecture (Plugin/Strategy Pattern)**: Avoid hardcoding game types (e.g., hardcoded enums 'CARO' | 'BINGO' or game-specific gateway event handlers). Use an abstract `IGameEngine` interface and a dynamic `GameRegistry` so that new games can be added effortlessly without modifying core Room or Gateway code.
- **Prisma 7 Driver Adapter & Config**: Prisma 7 uses `prisma.config.ts` with `datasource: { url: ... }` (singular) and requires driver adapters like `@prisma/adapter-pg` + `pg` rather than the old Rust query engine. Always import `dotenv/config` so CLI commands can resolve environment variables.
- **Cloud Infrastructure for Restricted Environments**: When developer laptops block local Docker, PostgreSQL, or DBeaver, utilize zero-install Cloud providers: Supabase for PostgreSQL and Upstash for Redis. For Redis, `@upstash/redis` (REST over HTTPS port 443) reliably bypasses local firewall blocks on TCP port 6379.
- **Scalable Multiplayer Schema**: Never hardcode player slots (e.g., `player1Id`, `player2Id`) in match history. Use a junction `MatchParticipant` model with `seatIndex`, `score`, `rank`, and `isWinner` to seamlessly accommodate 1v1, 2v2, 4-player Bingo, or N-player party mini-games.
- **Zero Hard-Coded Defaults & URLs**: Never hard-code default URLs, mock/fallback image URLs, CDN paths, or default assets in services, controllers, or DTOs. Always define them in dedicated constants files under the designated `constants/` directory (e.g. `server/src/common/constants/defaults.ts`).
