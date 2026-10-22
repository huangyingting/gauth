# Acceptance Criteria — Gauth AI Study Companion

## AC-1: Complete Gauth Feature & Course Parity
1. **Left Navigation & Responsive Shell**:
   - Desktop (`1440x900`) displays collapsible sidebar with `Homework`, `Academy`, `Atlas`, `Resources`, `App`, account quota widget (`Queries 3 / 3`, `Gauth AI Pro 1 / 1`), and `Upgrade` button.
   - Mobile (`390x844`) collapses sidebar into a toggleable drawer while preserving full access to all workflows.
2. **Homework AI Study Helper (`/`, `/search-question`)**:
   - Users can type any STEM/humanities question, use the interactive Math Keyboard, or upload/paste an image.
   - Submitting navigates to `/search-question` and displays `Question`, `Gauth AI Solution`, `Answer`, `Explanation`, `Review of Key Concepts`, numbered `Step-by-Step Solution`, `Helpful`/`Not Helpful` buttons, and `Gauth AI Pro` verification (`Check answer now`).
3. **Gauth Academy (`/course/science`, `/course/math`, `/course/history`, `/course/my`, `/course/[category]/[slug]/learn`)**:
   - `Science Labs` lists all 12 courses across `How Things Work`, `Biology`, `Chemistry`, and `Medicine`.
   - `Math Curriculum` lists `Algebra 1` (20 units, 77 lessons, 599 topics), `Algebra 2` (20 units, 67 lessons), and `Geometry` (21 units, 61 lessons) with working `Show 14 more` / `Show 15 more` expanders and unit detail pages (`/course/math/[curriculum]?unit=...`).
   - `History Signature` lists all 8 signature courses (`Smoke, Steam, and Progress`, `Crossing the Ocean Wall`, `Four Fuses and a Spark`, `The Price of Ending War`, `From Samurai to Smoke`, `From Versailles to Warsaw`, `Chasing Silver Across Seas`, `From Lies to the Trenches`).
   - `My Course` & `Create Course` modal allow generating new interactive AI courses from any topic or suggested chips (`Perimeter and Area of Rectangles`, `Rocks, Minerals and the Rock Cycle`, `Goods and Services`) with `Shuffle`.
   - Course Lesson Player (`/course/[category]/[slug]/learn`) renders the audio prompt modal (`Enable audio to continue`), interactive pan/zoom simulation canvas, block navigation (`Previous block`, `Play`/`Pause`, `Next block`), `Settings` popover (`Speed`, `Narration`, `Captions`, `Zoom`, `Export PDF`), and `Ask Tutor` assistant.
4. **Gauth Atlas (`/atlas`, `/atlas/world_map`, `/atlas/session/[id]`)**:
   - `/atlas` renders the collapsible topic drawer, visual story prompt composer, `Interactive AP US History Map` banner, all 6 Popular Video Stories, all 13 Popular Interactive Story Sessions, and the 6 FAQ items.
   - `/atlas/world_map` renders the interactive US/World map with timeline year slider (`1490–2026`), category filters (`Person`, `Politics`, `Economy`, `Other`), and `Knowledge Library` POI drawer (`Featured` & `Mine` tabs, search filter, and rich historical POIs).
   - `/atlas/session/[id]` renders the spatial story canvas (`View` vs `Details`), chapter cards, thumbnail strip, and `Generate Video` popover with 16 voiceover languages.
5. **Resources, Plus, Download & Legal Pages**:
   - `/news`, `/blog`, `/blog/[slug]`, `/trust-center`, `/plus`, `/download`, `/aboutus`, `/honor`, `/policy`, `/terms`, and `/writing-examples` render with full content parity.

---

## AC-2: Production Invite-Only Admission & Security Invariants
1. **No Demo Users**: Fresh database migrations contain `0` user rows.
2. **CLI-Only Admin Bootstrap**: `npm run bootstrap:admin -- --email <email> --name "<name>" --password-stdin` creates the initial `Admin` and writes `ADMIN_BOOTSTRAPPED` to `AuditLog`. Re-running when an admin already exists fails safely.
3. **Single-Use Expiring Invitations**:
   - `Admin` can create invitations for a target email and role (`Admin`, `Creator`, `Viewer`).
   - Database stores only `SHA-256(rawToken)` in `tokenHash`.
   - Accepting `/invite/[token]` creates the user and marks the invitation `ACCEPTED` atomically; a second attempt returns `410 Gone`.
4. **Revocation & Audit Logging**:
   - Revoking an invitation prevents redemption (`410 Gone`) and frees `activeForEmail`.
   - Revoking a user sets `revokedAt`, deletes all active `Session` records immediately, blocks future sign-ins, and records `USER_REVOKED` in `AuditLog`.
