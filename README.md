# Bunny Cove 🐰🌸

> **A cozy, intimate 2-player real-time mobile application for couples and close friends.**  
> Featuring private rooms, pluggable turn-based mini-games (Caro & Bingo), and in-room real-time chat with cute bunny stickers.

---

## 🌟 Highlights & Features

- **🏡 Private 2-Player Rooms**:
  - Instant room creation with cute room codes (e.g. `BUNNY-93`, `HOPPY-42`).
  - Strict 2-player capacity, synchronized ready states, and automated 30s disconnection grace period.
- **🎮 Pluggable Game Engine (Strategy Pattern)**:
  - Modular game system powered by an abstract `IGameEngine` interface and a dynamic `GameRegistryService`.
  - Adding future games (Chess, Battleship, Connect 4) requires zero modifications to the core room gateway.
  - **Game 1 - Caro (Gomoku)**: 15x15 grid, server-authoritative win validation (5-in-a-row), turn countdown timer.
  - **Game 2 - Bingo**: 5x5 board, auto-shuffle setup, synchronized number calling, and 5-line B-I-N-G-O tracking.
- **💬 Real-Time In-Room Chat**:
  - Instant messaging with cute bunny emoji sticker packs and canned quick reactions.
- **🎨 Cozy Pastel Aesthetics**:
  - Tailored pastel color palette (Peach, Soft Sage, Cream, Mauve) with smooth animations and native iOS haptic feedback.

---

## 📁 Repository Structure

```text
Bunny Cove/
├── mobile/                  # Flutter Mobile Client (iOS & Android)
│   ├── lib/
│   │   ├── core/            # Theme, NavigationUtils, ScreenUtil config
│   │   └── features/        # Feature-based modules (room, caro, bingo, chat)
│   └── pubspec.yaml
│
├── server/                  # NestJS Realtime WebSocket & REST Server
│   ├── prisma/              # Prisma 7 Schema (PostgreSQL)
│   ├── src/
│   │   ├── common/          # Standard response formats, exception filters, response-codes
│   │   └── modules/
│   │       ├── room/        # 2-player room management & Socket.IO gateway
│   │       └── games/       # Pluggable game engines & GameRegistry
│   └── package.json
│
├── tasks/                   # Project Workflow & Tracking
│   ├── todo.md              # Active implementation checklist & progress
│   └── lessons.md           # Continuous improvement & guidelines
│
├── AGENTS.md                # System-level agent instructions & constraints
├── general.md               # Master system specification & database architecture
├── rule.md                  # Comprehensive development bundle (Pawdar project rules)
└── README.md                # Project documentation overview
```

---

## 🛠️ Tech Stack

| Layer | Technology | Key Libraries / Frameworks |
| :--- | :--- | :--- |
| **Mobile Client** | **Flutter** (Dart >= 3.0.0) | `flutter_bloc` / `cubit`, `flutter_screenutil`, `socket_io_client`, `dio`, `google_fonts` |
| **Backend Server** | **NestJS** (Node.js >= 18) | `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`, `class-validator` |
| **Database & Cache**| **PostgreSQL** + **Redis** | `Prisma ORM 7` (persistent data) + `Redis` (real-time session cache & adapter) |
| **Communication**  | **WebSockets (WSS)** | Low-latency duplex event communication |

---

## 🚀 Getting Started

### 1. Server Setup (`server/`)

#### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v24)
- `npm` (v10+)
- PostgreSQL database (optional for initial in-memory testing)

#### Installation & Running
```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Build TypeScript
npm run build

# Run development server (watch mode)
npm run start:dev

# Run automated WebSocket room verification test
node test/verify-room-gateway.mjs
```
The server runs on `http://localhost:3000` by default.

---

### 2. Mobile Setup (`mobile/`)

#### Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (>= 3.0.0)
- For iOS: macOS with Xcode and CocoaPods (`sudo gem install cocoapods`)

#### Running the Mobile App
```bash
# Navigate to mobile
cd mobile

# Fetch packages
flutter pub get

# Run on connected iOS Simulator or Device
flutter run
```

---

## 🌿 Branching Strategy

This project follows an organized Git Flow model:

- **`main`**: Production-ready, stable codebase.
- **`deploy`**: Staging and infrastructure deployment configurations.
- **`dev`**: Active feature development and ongoing integration.

---

## 📖 Architectural & Specification Docs

- 📜 **[rule.md](rule.md)**: Master coding standards (Cubit, ScreenUtil, 3-layer backend, response codes sync).
- 📐 **[general.md](general.md)**: Detailed feature specifications, data models, and WebSocket event catalog.
- ✅ **[tasks/todo.md](tasks/todo.md)**: Current roadmap, phases, and task checklist.
- 💡 **[tasks/lessons.md](tasks/lessons.md)**: Recorded feedback and architectural decisions.
