# Technical Specification (SPEC) — Gauth Platform

## 1. Route Architecture

| Route | Access Level | Description |
|---|---|---|
| `/` | Public / Authenticated | Homework AI Study Helper landing page, question/image composer, subject pills, Atlas & Academy showcases |
| `/search-question` | Public / Authenticated | Interactive AI Step-by-Step Question Solver, LaTeX math steps, Review of Key Concepts, Gauth AI Pro check, AI Tutor follow-up |
| `/course/science` | Public / Authenticated | Gauth Academy — Science Labs (12 courses across Physics/How Things Work, Biology, Chemistry, Medicine) |
| `/course/math` | Public / Authenticated | Gauth Academy — Math Curriculum (Algebra 1, Algebra 2, Geometry with expandable unit grids) |
| `/course/math/[curriculum]` | Public / Authenticated | Math Curriculum unit & lesson explorer (`/course/math/algebra-1`, `algebra-2`, `geometry`) |
| `/course/history` | Public / Authenticated | Gauth Academy — History Signature (8 interactive historical courses) |
| `/course/my` | Public / Authenticated | Gauth Academy — User-created AI courses (`Create a Course` modal & course management) |
| `/course/[category]/[slug]/learn` | Public / Authenticated | Interactive Course Lesson Player (pan/zoom simulation canvas, blocks, audio/narration, speed, captions, PDF export, Ask Tutor) |
| `/atlas` | Public / Authenticated | Gauth Atlas visual story hub, topic drawer, prompt composer, Popular Stories, FAQ |
| `/atlas/world_map` | Public / Authenticated | Interactive AP US History World Map with timeline scrubber (`1490–2026`), category filters, and Knowledge Library drawer |
| `/atlas/session/[id]` | Public / Authenticated | Spatial Visual Story Session canvas (`View`/`Details` modes, chapters, `Generate Video` popover in 16 languages) |
| `/news` | Public | Gauth in the News media press coverage |
| `/blog` & `/blog/[slug]` | Public | Gauth Study Guides & Blog articles |
| `/trust-center` | Public | Gauth Trust Center, Safety, Privacy, and Product Guides |
| `/plus` | Public / Authenticated | Gauth PLUS subscription plans & quota upgrade workflow |
| `/download` | Public | Mobile app QR & store links |
| `/aboutus`, `/honor`, `/policy`, `/terms`, `/writing-examples` | Public | Company information, Academic Integrity Honor Code, Privacy Policy, Terms of Service, and Writing Examples |
| `/auth/signin` | Public | Credentials & OAuth sign-in page (with link notice for invite-only registration) |
| `/invite/[token]` | Public (Token-gated) | Single-use invitation validation and account registration page |
| `/admin/invitations` | `Admin` Role Only | Invitation management (issue, copy token URL, revoke), user management (revoke user), and security Audit Log viewer |

---

## 2. REST API Endpoints

### 2.1 Authentication & Account Admission APIs
- `GET/POST /api/auth/[...nextauth]`: NextAuth v4 handler with Prisma Adapter, database session strategy, Credentials provider, and optional GitHub/Google OAuth providers with invite-token binding.
- `GET /api/invitations/[token]`: Validates raw invitation token (`200 OK` with masked email, role, expiry; `404` invalid; `410` expired/revoked/accepted).
- `POST /api/invitations/[token]/accept`: Atomically claims a valid invitation token, creates the `User` with `bcrypt`-hashed password (rounds = 12), and writes `INVITATION_ACCEPTED` to `AuditLog`.
- `GET /api/admin/invitations`: Lists invitations, active/revoked users, and recent `AuditLog` entries (`Admin` only).
- `POST /api/admin/invitations`: Issues a new single-use invitation for `email` and `role`, storing only `SHA-256(rawToken)` and returning the one-time `inviteUrl` (`Admin` only).
- `PATCH /api/admin/invitations/[id]`: Revokes a pending invitation (`status = "REVOKED"`, `activeForEmail = null`) and logs `INVITATION_REVOKED` (`Admin` only).
- `DELETE /api/admin/users/[id]`: Revokes a user (`revokedAt = now()`), deletes all active `Session` records in the same transaction, and logs `USER_REVOKED` (`Admin` only).

### 2.2 Gauth Educational Domain APIs
- `POST /api/homework/solve`: Accepts `questionText`, `subject`, `imageDataUrl` (optional), and `proMode` (boolean). Generates structured pedagogical solution (`answer`, `explanation`, `keyConcepts`, `steps`, `followUpSuggestions`), persists `HomeworkQuestion`, and updates user quota if authenticated.
- `GET /api/homework/history`: Returns recent solved questions.
- `GET /api/courses`: Returns catalog courses (`science`, `math`, `history`) and user-generated courses (`my`).
- `POST /api/courses/create`: Generates a new multi-block interactive AI course from `topic` prompt, persists `CustomCourse`, and decrements daily course creation quota.
- `POST /api/courses/tutor`: Contextual AI Tutor Q&A inside the Course Lesson Player (`/course/[category]/[slug]/learn`).
- `GET /api/atlas/sessions`: Lists popular and user-created Atlas visual story sessions.
- `POST /api/atlas/sessions`: Generates a new multi-chapter visual story session from `prompt` and `webSearch` flag.
- `GET/POST /api/atlas/pois`: Lists AP US History World Map POIs filtered by `year`, `category`, `source` (`featured` vs `mine`), and `search`; `POST` allows authenticated users to pin a new custom historical POI.
- `POST /api/plus/subscribe`: Upgrades the current user's plan (`MONTHLY`, `QUARTERLY`, `ANNUAL`) and resets/unlocks unlimited quotas.

---

## 3. UI States, Edge Cases, and Responsive Design
- **Empty States**:
  - `/course/my`: Displays `"Build AI courses from any topic — Click Create to build lessons"` with `+ Create` CTA when no custom courses exist.
  - `/atlas` session drawer: Displays `"No topics yet. Start one now to begin."` when no custom topics match search.
- **Error & Guard States**:
  - Invalid/expired/used/revoked invitation tokens on `/invite/[token]` render explicit status banners (`404 Not Found` vs `410 Gone`).
  - Exhausted free quota (`Queries 0/3` or `Remaining uses today: 0`) triggers the `Gauth PLUS` upgrade modal with option to upgrade or continue in standard mode.
  - Non-admin users accessing `/admin/invitations` receive `403 Forbidden` / redirect.
- **Responsive Breakpoints**:
  - **Desktop (`>= 1024px`, e.g., `1440x900`)**: Persistent collapsible left sidebar (`220px` expanded, `64px` collapsed), multi-column course/story grids, split-screen Course Player and World Map POI drawer.
  - **Tablet/Mobile (`< 1024px`, e.g., `390x844`)**: Top header with hamburger drawer toggle, single-column stacked cards, bottom-sheet Course Player controls and Atlas POI drawer.
