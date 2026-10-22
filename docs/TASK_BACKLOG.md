# Engineering Task Backlog — Gauth Platform

| ID | Category | Task | Priority | Status |
|---|---|---|---|---|
| TB-01 | Discovery | Playwright exploration of `https://www.gauth.com` using `.cred` cookies | P0 | Done |
| TB-02 | Discovery | Capture all courses in Science Labs, Math Curriculum (61 units, 205 lessons), History Signature, and My Course | P0 | Done |
| TB-03 | Discovery | Capture Gauth Atlas hub, AP US History World Map (152 POIs), Visual Story Sessions, and Video Settings | P0 | Done |
| TB-04 | Discovery | Capture Homework AI step-by-step solving scenario & mobile responsive viewports (`390x844`) | P0 | Done |
| TB-05 | Docs | Author ADR, PRD, SPEC, NEXTAUTH_INVITE_ONLY_SPEC, ARCHITECTURE_DATA_MODEL, IMPLEMENTATION_PLAN, TASK_BACKLOG, ACCEPTANCE_CRITERIA, FEATURE_PARITY | P0 | Done |
| TB-06 | Database | Create dual SQLite (`prisma/schema.prisma`) and PostgreSQL (`prisma/schema.postgres.prisma`) schemas and migrations | P0 | Pending |
| TB-07 | Auth | Implement `src/lib/account-admission/*` (SHA-256 token hashing, atomic claim, RBAC, revocation, audit logs) | P0 | Pending |
| TB-08 | Auth | Implement `scripts/bootstrap-admin.ts` CLI (`npm run bootstrap:admin`) with zero demo accounts | P0 | Pending |
| TB-09 | Auth | Implement NextAuth database session routes, `/auth/signin`, `/invite/[token]`, and `/admin/invitations` | P0 | Pending |
| TB-10 | Core UI | Build responsive `GauthSidebarShell` matching Gauth desktop & mobile navigation, quota card, and Plus modal | P0 | Pending |
| TB-11 | Homework | Build Homework AI Study Helper (`/`) with Math Keyboard, Image Upload, Subject Pills, and `/search-question` step-by-step solver | P0 | Pending |
| TB-12 | Academy | Build `/course/science`, `/course/math`, `/course/math/[curriculum]`, `/course/history`, `/course/my`, and `Create a Course` modal | P0 | Pending |
| TB-13 | Academy | Build Interactive Course Lesson Player (`/course/[category]/[slug]/learn`) with simulation canvas, audio/speed/caption settings, and AI Tutor | P0 | Pending |
| TB-14 | Atlas | Build Gauth Atlas Hub (`/atlas`), AP US History World Map (`/atlas/world_map`), and Visual Story Session (`/atlas/session/[id]`) | P0 | Pending |
| TB-15 | Content | Build `/news`, `/blog`, `/blog/[slug]`, `/trust-center`, `/plus`, `/download`, `/aboutus`, `/honor`, `/policy`, `/terms`, `/writing-examples` | P1 | Pending |
| TB-16 | QA | Write & execute unit, integration, and Playwright E2E tests + production `npm run build` | P0 | Pending |
