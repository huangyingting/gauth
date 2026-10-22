# Implementation Plan — Gauth AI Study Companion

## Phase 1: Playwright Exploration & Catalog Extraction (Completed)
- Authenticated with `.cred` cookies against `https://www.gauth.com`.
- Captured 37+ desktop and mobile screenshots in `/home/azadmin/gauth/screenshots/`.
- Extracted complete course catalogs:
  - 12 `Science Labs` courses (`How Things Work`, `Biology`, `Chemistry`, `Medicine`).
  - 3 `Math Curriculum` tracks (`Algebra 1` with 20 units / 77 lessons, `Algebra 2` with 20 units / 67 lessons, `Geometry` with 21 units / 61 lessons).
  - 8 `History Signature` courses.
  - `My Course` + `Create a Course` modal & Interactive Course Player (`/course/[category]/[slug]/learn`).
  - `Gauth Atlas` hub, 6 Video Stories, 13 Interactive Visual Story Sessions, and `Interactive AP US History Map` (`/atlas/world_map`) with 152 knowledge points.
  - `Homework AI Study Helper` (`/`, `/search-question`) with step-by-step LaTeX solutions, `Review of Key Concepts`, and `Gauth AI Pro`.
  - `Resources` (`/news`, `/blog`, `/trust-center`), `Gauth PLUS` (`/plus`), `App` (`/download`), and Company/Legal pages (`/aboutus`, `/honor`, `/policy`, `/terms`, `/writing-examples`).

## Phase 2: Project Scaffolding & Dual-DB Prisma Setup
- Configure `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, and Tailwind CSS.
- Create `prisma/schema.prisma` (SQLite) and `prisma/schema.postgres.prisma` (PostgreSQL) plus initial migration SQL.
- Configure `src/lib/prisma.ts` to auto-select `@prisma/adapter-better-sqlite3` or `@prisma/adapter-pg`.

## Phase 3: Invite-Only Authentication, RBAC, Revocation & CLI Admin Bootstrap
- Implement `src/lib/account-admission/*` (`tokens.ts`, `audit.ts`, `invitations.ts`, `bootstrap-admin.ts`, `users.ts`, `index.ts`).
- Implement `scripts/bootstrap-admin.ts` (`npm run bootstrap:admin`) with `--password-stdin` and zero demo accounts.
- Implement NextAuth configuration (`src/lib/auth.ts` & `src/app/api/auth/[...nextauth]/route.ts`) with database session strategy and revocation checks.
- Build `/auth/signin`, `/invite/[token]`, and `/admin/invitations` UI + API routes.

## Phase 4: Replicating Gauth Core Features & Responsive UI
- Build the global collapsible `GauthShell` sidebar (`Homework`, `Academy`, `Atlas`, `Resources`, `App`, `Admin`, account quota widget, `Gauth PLUS` modal).
- Build `Homework AI Study Helper` (`/`) and `/search-question` with interactive Math Keyboard modal, image upload/OCR preview, subject tabs, and step-by-step LaTeX solver.
- Build `Gauth Academy` (`/course/science`, `/course/math`, `/course/math/[curriculum]`, `/course/history`, `/course/my`, `Create a Course` modal) and Interactive Course Player (`/course/[category]/[slug]/learn`).
- Build `Gauth Atlas` (`/atlas`, `/atlas/world_map` with interactive timeline & POI drawer, `/atlas/session/[id]` with `View`/`Details` modes and 16-language `Generate Video` popover).
- Build `Resources` (`/news`, `/blog`, `/blog/[slug]`, `/trust-center`), `/plus`, `/download`, `/aboutus`, `/honor`, `/policy`, `/terms`, `/writing-examples`.

## Phase 5: Verification, Testing & Deployment Readiness
- Run unit & integration tests (`npm test`) covering STEM solver, catalog completeness, and invite-only admission/revocation/audit log invariants.
- Run Playwright E2E tests verifying all routes, interactive workflows, responsive layouts, and invite-only admin bootstrap flow.
- Verify production build (`npm run build`).
