# System Architecture & Data Model — Gauth Platform

## 1. High-Level System Architecture

```
+-----------------------------------------------------------------------------------+
|                        Browser / Responsive Client (React 19)                     |
|  - Collapsible Sidebar Shell (/ , /course/*, /atlas/*, /news, /blog, /plus, etc.) |
|  - Homework AI Composer + Math Keyboard + Image OCR + Step-by-Step LaTeX Solver   |
|  - Gauth Academy (Science Labs, Math Curriculum, History Signature, Course Player)|
|  - Gauth Atlas (Visual Story Composer, AP US History World Map, Spatial Canvas)   |
|  - Invite Redemption (/invite/[token]) & Admin Console (/admin/invitations)       |
+-----------------------------------------+-----------------------------------------+
                                          | HTTPS / JSON / NextAuth Cookie
+-----------------------------------------v-----------------------------------------+
|                        Next.js 16 App Router Server Layer                         |
|  - Auth.js / NextAuth v4 (`/api/auth/[...nextauth]`) with Database Sessions       |
|  - Account Admission Service (`src/lib/account-admission/*`)                      |
|  - Educational Domain Engine (`src/lib/gauth-data/*` & `src/lib/solver-engine.ts`)|
|  - Route Handlers (`/api/invitations/*`, `/api/admin/*`, `/api/homework/*`,       |
|    `/api/courses/*`, `/api/atlas/*`, `/api/plus/*`)                               |
+-----------------------------------------+-----------------------------------------+
                                          | Prisma 7 Driver Adapter
+-----------------------------------------v-----------------------------------------+
|      SQLite (`better-sqlite3` for Local Dev/Test)  |  PostgreSQL (`pg` for Prod)  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Prisma Data Model (`prisma/schema.prisma` & `prisma/schema.postgres.prisma`)

### 2.1 Identity, Invite-Only Admission & Audit Models
- **`User`**:
  - `id` (`String @id @default(cuid())`)
  - `name` (`String?`), `email` (`String @unique`), `emailVerified` (`DateTime?`), `image` (`String?`)
  - `passwordHash` (`String?`) — bcrypt cost 12
  - `role` (`String @default("Creator")`) — `"Admin" | "Creator" | "Viewer"`
  - `plan` (`String @default("FREE")`) — `"FREE" | "PLUS_MONTHLY" | "PLUS_QUARTERLY" | "PLUS_ANNUAL"`
  - `queriesRemaining` (`Int @default(3)`)
  - `aiProRemaining` (`Int @default(1)`)
  - `atlasCreditsRemaining` (`Int @default(10)`)
  - `courseCreatesRemaining` (`Int @default(3)`)
  - `invitedById` (`String?`), `revokedAt` (`DateTime?`), `createdAt`, `updatedAt`
- **`Account`**, **`Session`**, **`VerificationToken`**:
  - Standard NextAuth Prisma Adapter tables with cascading delete on `User`.
- **`Invitation`**:
  - `id` (`String @id @default(cuid())`)
  - `email` (`String`), `activeForEmail` (`String? @unique`)
  - `tokenHash` (`String @unique`) — SHA-256 hex digest of raw 32-byte base64url token
  - `role` (`String @default("Creator")`)
  - `status` (`String @default("PENDING")`) — `"PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED"`
  - `expiresAt` (`DateTime`), `invitedById` (`String`), `acceptedById` (`String? @unique`), `acceptedAt`, `revokedAt`, `createdAt`
- **`AuditLog`**:
  - `id` (`String @id @default(cuid())`)
  - `actorId` (`String?`), `actorEmail` (`String?`)
  - `action` (`String`) — `ADMIN_BOOTSTRAPPED`, `INVITATION_CREATED`, `INVITATION_ACCEPTED`, `INVITATION_REVOKED`, `SIGN_IN_SUCCEEDED`, `SIGN_IN_REJECTED`, `USER_REVOKED`
  - `targetType` (`String`), `targetId` (`String?`), `metadata` (`String?`), `ipAddress` (`String?`), `userAgent` (`String?`), `createdAt` (`DateTime @default(now())`)

### 2.2 Gauth Educational Domain Models
- **`HomeworkQuestion`**:
  - `id` (`String @id @default(cuid())`)
  - `questionText` (`String`), `subject` (`String @default("Math")`), `imageDataUrl` (`String?`)
  - `answerSummary` (`String`), `explanation` (`String`), `keyConceptsJson` (`String`), `stepsJson` (`String`)
  - `isProVerified` (`Boolean @default(false)`), `helpfulCount` (`Int @default(0)`), `userId` (`String?`), `createdAt` (`DateTime @default(now())`)
- **`CustomCourse`**:
  - `id` (`String @id @default(cuid())`)
  - `slug` (`String @unique`), `title` (`String`), `subtitle` (`String`), `category` (`String @default("my")`), `discipline` (`String @default("AI Generated")`)
  - `blocksJson` (`String`) — Interactive simulation blocks, chapters, narration scripts, and quiz checkpoints
  - `progressPercent` (`Int @default(0)`), `userId` (`String?`), `createdAt` (`DateTime @default(now())`)
- **`AtlasSessionRecord`**:
  - `id` (`String @id @default(cuid())`)
  - `title` (`String`), `subtitle` (`String`), `category` (`String @default("History")`)
  - `chaptersJson` (`String`) — Visual story chapters (`The Crucible's Breath`, etc.), images, and source citations
  - `videoConfigJson` (`String?`), `userId` (`String?`), `createdAt` (`DateTime @default(now())`)
- **`CustomWorldMapPoi`**:
  - `id` (`String @id @default(cuid())`)
  - `title` (`String`), `summary` (`String`), `region` (`String`), `category` (`String`) — `"Person" | "Politics" | "Economy" | "Other"`
  - `startYear` (`Int`), `endYear` (`Int`), `lat` (`Float`), `lng` (`Float`), `userId` (`String?`), `createdAt` (`DateTime @default(now())`)
