---
name: compact
description: >-
  Triggered when the user types "/compact" or requests a full context compaction/summary
  of the project state, progress, architecture, technical decisions, and next steps.
---

# Project Context Compaction Skill (`/compact`)

Use this skill whenever the user types `/compact` or asks to compact the chat context, summarize current progress, or prepare a high-density state summary for resuming work.

## Compaction Procedure

When activated, the agent must perform the following structured steps:

### 1. Inspect Workspace State
- Verify the current active branch and working tree using `git status`.
- Check [tasks/todo.md](file:///c:/Bone/Private/Bunny%20Cove/tasks/todo.md) for current phase status.
- Review recent implementations in `server/` or `mobile/`.
- Ensure adherence to [AGENTS.md](file:///c:/Bone/Private/Bunny%20Cove/AGENTS.md) (Vietnamese for communication, English for code/commits).

### 2. Output High-Density Compaction Report
Format the response in Vietnamese with clear, high-density sections:

1. **Tổng quan Dự án (Project Overview & Goal)**:
   - Tên dự án, thể loại (Game 2 người & Multiplayer realtime, Caro 15x15, Bingo 5x5, Chat & Stickers).
   - Theme phong cách thẩm mỹ ([design-style.md](file:///c:/Bone/Private/Bunny%20Cove/design-style.md)).

2. **Tiến độ Thực tế (Completed Features & Milestones)**:
   - Chi tiết các pha đã hoàn thành (Phase 0, Phase 1, Phase 2, v.v.).
   - Liệt kê các module đã viết (Room Gateway, Auth JWT, Prisma PostgreSQL, Upstash Redis).
   - Kết quả kiểm thử tự động (Integration tests passing).

3. **Kiến trúc Kỹ thuật & Hạ tầng (Architecture & Infrastructure)**:
   - **Backend**: NestJS, NodeNext ESM (`.js` imports), 3-Layer Clean Architecture, Socket.IO.
   - **Database**: Cloud PostgreSQL trên Supabase (Tokyo `aws-0-ap-northeast-1`) qua Prisma 7 (`@prisma/adapter-pg`).
   - **Multiplayer Schema**: `User`, `Match`, `MatchParticipant` (hỗ trợ N người chơi, seatIndex, score, rank, isWinner), `UserStats` (ELO points), `Friendship`, `ChatMessage`.
   - **Cache & Realtime**: Upstash Serverless Redis kết nối qua REST HTTPS (`@upstash/redis`), kèm in-memory fallback.
   - **Auth**: Access Token (15m, Bearer), Refresh Token (7d, HTTP-only Cookie + Token Rotation), Bcrypt salt 10 rounds.
   - **API Docs**: Swagger UI tại `/api/docs`.

4. **Các Lưu ý Kỹ thuật Quan trọng (Critical Gotchas & Lessons)**:
   - Các lưu ý về ESM NodeNext imports phải có đuôi `.js`.
   - File `.env` chứa credentials thực tế và được gitignore.
   - Cơ chế fallback linh hoạt (In-memory) giúp app không bao giờ crash kể cả khi offline.

5. **Kế hoạch Kế tiếp (Next Actionable Steps)**:
   - Liệt kê 2-3 tác vụ ưu tiên cao nhất cần thực hiện tiếp theo (ví dụ: Chat Realtime & Sticker Thỏ, Game Engine Caro/Bingo, hoặc khởi tạo Mobile Flutter).
