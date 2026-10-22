# Architecture Decision Records (ADR) — Gauth AI Study Companion Platform

## ADR-001: Next.js 16 App Router with TypeScript and Tailwind CSS
- **Status**: Accepted
- **Context**: `https://www.gauth.com` combines SEO-friendly static/server-rendered catalog pages (`/`, `/course/science`, `/course/math`, `/course/history`, `/news`, `/blog`, `/trust-center`, `/plus`, `/download`, `/aboutus`, `/honor`, `/policy`, `/terms`) with deeply interactive client experiences (`/search-question`, `/course/[category]/[slug]/learn`, `/atlas`, `/atlas/world_map`, `/atlas/session/[id]`).
- **Decision**: Use Next.js 16 (App Router) with React 19, TypeScript, and Tailwind CSS. Server Components and Route Handlers (`src/app/api/*`) handle authenticated session validation, database queries, and server-side rendering, while Client Components power the interactive STEM equation editor, 2D/3D simulation canvas in Course Player, AP US History World Map timeline & POI explorer, and Gauth Atlas spatial story canvas.
- **Consequences**: Unified full-stack codebase with zero CORS overhead, strict type safety, and fast initial page loads across desktop (`1440x900`) and mobile (`390x844`) viewports.

---

## ADR-002: NextAuth.js v4 with Database Sessions and Invite-Only Admission
- **Status**: Accepted
- **Context**: The platform must run in production without public open registration or any pre-seeded demo user accounts. Access must be governed by single-use, expiring invitation links with role assignment (`Admin`, `Creator`, `Viewer`), immediate user/invitation revocation, and immutable audit logging, referencing `../Arcade`.
- **Decision**:
  1. Use `next-auth` (`v4.24.15`) with `@auth/prisma-adapter` and `session.strategy = "database"`.
  2. Disable public sign-up. Only invited users with a valid, unexpired, unrevoked single-use token (`/invite/[token]`) can create an account or bind an OAuth identity.
  3. Store only the SHA-256 hex digest (`tokenHash`) of invitation tokens in the `Invitation` table. Enforce at most one active pending invitation per normalized email via `activeForEmail @unique`.
  4. Claim invitations inside a serializable/atomic Prisma transaction using `updateMany` with status and timestamp guards so concurrent redemption attempts cannot double-claim a token.
  5. Bootstrap the initial administrator strictly via the deployment CLI script (`npm run bootstrap:admin` reading password from `--password-stdin`). Never expose an HTTP bootstrap endpoint and never seed demo user accounts.
- **Consequences**: Immediate server-side session invalidation upon user revocation (`DELETE /api/admin/users/[id]` deletes `Session` rows in the same transaction), cryptographic protection of invitation tokens at rest, and full compliance with production security requirements.

---

## ADR-003: Dual-Database Prisma 7 Architecture (SQLite Local Dev + PostgreSQL Production)
- **Status**: Accepted
- **Context**: Local development and CI tests require zero-configuration SQLite (`better-sqlite3`), while production deployments require PostgreSQL (`pg`).
- **Decision**:
  1. Use Prisma `7.10.1` with `@prisma/adapter-better-sqlite3` for SQLite (`prisma/schema.prisma`) and `@prisma/adapter-pg` for PostgreSQL (`prisma/schema.postgres.prisma`).
  2. Configure `prisma.config.ts` and `src/lib/prisma.ts` to automatically detect `postgresql://` vs `file:` in `DATABASE_URL` and instantiate the matching driver adapter.
- **Consequences**: Identical Prisma Client API across development, testing, and production environments with native driver performance.

---

## ADR-004: Hybrid AI & Deterministic Pedagogical Engine for Homework Solver, Academy Courses, and Atlas
- **Status**: Accepted
- **Context**: Gauth provides four core educational workflows:
  1. **Homework AI Study Helper** (`/`, `/search-question`): Step-by-step STEM & humanities problem solving with LaTeX math rendering, Review of Key Concepts, numbered solving steps, and Gauth AI Pro deep verification.
  2. **Gauth Academy** (`/course/science`, `/course/math`, `/course/history`, `/course/my`, `/course/[category]/[slug]/learn`): Full catalog of 12 Science Labs, 3 Math Curriculums (Algebra 1 with 20 units/77 lessons, Algebra 2 with 20 units/67 lessons, Geometry with 21 units/61 lessons), 8 History Signature courses, AI Course Creator (`Create a Course` modal with daily quota tracking), and an interactive Course Player with pan/zoom simulation canvas, narration/audio controls, speed selector (`0.75x`–`2x`), captions, PDF export, and contextual `Ask Tutor` chat.
  3. **Gauth Atlas** (`/atlas`, `/atlas/world_map`, `/atlas/session/[id]`): Visual Story generator, Interactive AP US History Map (timeline scrubber `1490–2026`, category filters `Person`, `Politics`, `Economy`, `Other`, and `Knowledge Library` drawer), Popular Video Stories, and Spatial Story Sessions with multi-language AI Video Settings (`16 languages`).
  4. **Quota & Gauth PLUS Tiering** (`/plus`): Tracks Free Plan quotas (`Queries 3/3`, `Gauth AI Pro 1/1`, `Atlas 10 credits/mo`, `Create Course 3/day`) vs `Gauth PLUS` unlimited access (`1 Month S$6.99`, `3 Months S$16.99 with 3-Day Free Trial`, `12 Months S$43.99 -30%`).
- **Decision**: Persist all user-generated questions, custom AI courses, course progress, Atlas sessions, and quota usage in Prisma models while providing a rich, deterministic + optional LLM-backed pedagogical engine that works out-of-the-box in any environment.
- **Consequences**: 100% functional parity with `https://www.gauth.com`, persistent user workspaces, and deterministic automated testing.
