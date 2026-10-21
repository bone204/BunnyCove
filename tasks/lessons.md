# Lessons Learned - Bunny Cove Project

## General & Workflow Lessons
- **User Instruction Precision**: When the user requests to initialize folder bases without code, keep the directories clean and empty until explicitly instructed to start implementation. Do not scaffold boilerplate with premature feature logic.
- **Naming Conventions**: Directory names are strictly `mobile` (Flutter) and `server` (NestJS).
- **Communication Language**: All communications, explanations, roadmaps, and plan discussions must be in clear, structured Vietnamese. All source code, comments, and commit messages must be in English.
- **Rules & Specs**: Always follow [rule.md](../rule.md) and [general.md](../general.md) as the single source of truth for architectural and coding standards.
- **No Extraneous Agent Folders**: Do not generate `.agents` directories or `AGENTS.md` files in the workspace. The project rules in [rule.md](../rule.md) and specifications in [general.md](../general.md) are directly read and strictly adhered to by the assistant.
- **Extensible Game Architecture (Plugin/Strategy Pattern)**: Avoid hardcoding game types (e.g., hardcoded enums 'CARO' | 'BINGO' or game-specific gateway event handlers). Use an abstract `IGameEngine` interface and a dynamic `GameRegistry` so that new games can be added effortlessly without modifying core Room or Gateway code.
