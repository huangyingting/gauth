# Product Requirements Document (PRD) — Gauth AI Study Companion

## 1. Executive Summary
**Gauth** (`Gauth it, Ace it!`) is an AI-powered educational platform that helps students understand complex topics, solve homework problems step-by-step, explore interactive STEM and history courses, and turn any topic into a visual story. This project replicates the complete functional and visual experience of `https://www.gauth.com` while hardening account admission for enterprise/production deployment with **Invite-Only Registration**, **Role-Based Access Control (RBAC)**, **Revocation**, **Audit Logging**, and **CLI-Only Admin Bootstrap** (zero pre-seeded demo user accounts).

---

## 2. Target Personas & Roles
1. **Admin (`Admin`)**:
   - Bootstrapped via CLI (`npm run bootstrap:admin`).
   - Issues single-use, expiring invitations (`/admin/invitations`), assigns roles (`Admin`, `Creator`, `Viewer`), revokes pending invitations or active users, and audits security events.
   - Has full access to all Gauth features and administrative controls.
2. **Student / Educator (`Creator`)**:
   - Joins via a single-use invitation link (`/invite/[token]`).
   - Solves homework questions via AI Study Helper, creates custom AI courses in `My Course`, generates visual stories in `Gauth Atlas`, practices interactive lessons in `Gauth Academy`, and manages their study history and Gauth PLUS plan.
3. **Read-Only Learner (`Viewer`)**:
   - Joins via a single-use invitation link with `Viewer` role.
   - Explores all catalog courses (`Science Labs`, `Math Curriculum`, `History Signature`), interactive `Atlas` stories and `AP US History World Map`, `News`, `Blog`, and `Trust Center`.

---

## 3. Core Product Modules & Functional Requirements

### 3.1 Left Sidebar & Global Navigation Shell
- Collapsible left navigation rail (desktop `1440px`) and slide-over drawer (mobile `390px`) with:
  - **Brand Logo**: `Gauth` (`/`)
  - **Primary Links**:
    - `Homework` (`/`)
    - `Academy` (`/course/science`, with tabs `/course/science`, `/course/math`, `/course/history`, `/course/my`)
    - `Atlas` (`/atlas`, `/atlas/world_map`, `/atlas/session/[id]`)
    - `Resources` (`/news`, `/blog`, `/trust-center`)
    - `App` (`/download`)
    - `Admin` (`/admin/invitations` — visible to `Admin` role)
  - **Bottom Account & Quota Widget**:
    - Displays user avatar/initial, account tier (`Free Account` or `Gauth PLUS`), live quota counters (`Queries 3 / 3`, `Gauth AI Pro 1 / 1`), `Upgrade` CTA (`/plus`), and `Sign Out` / `Sign In`.

### 3.2 Homework AI Study Helper (`/`, `/search-question`)
- **Hero Search & Upload Composer**:
  - Text/equation input (`Type or upload your question`) with interactive **Math Keyboard / Calculator** modal (fractions, exponents, roots, trigonometry, calculus integrals, matrices, Greek symbols).
  - Drag-and-drop / click / `Ctrl + V` image & document upload with OCR preview and crop area.
  - Subject quick-filter pills: `Math`, `Calculus`, `Chemistry`, `Biology`, `Business`, `Social Science`, `MORE`.
- **Interactive Step-by-Step Solution View (`/search-question`)**:
  - Displays the user's `Question`, `Gauth AI Solution` with `Answer`, teacher-style `Explanation`, `Review of Key Concepts` (with formatted mathematical formulas), and numbered `Step-by-Step Solution`.
  - Interactive `Helpful` / `Not Helpful` feedback buttons.
  - `Gauth AI Pro` deep-check card (`Check answer now`) and follow-up `Ask AI Tutor` thread.
- **Landing Showcase Sections**:
  - `Turn Any Subject Into a Visual Adventure` (Gauth Atlas interactive preview with `Watch Demo` and `Start Exploring`).
  - `Your AI Companion for Learning and Success` (`Step-by-step`, `Detailed explanations`, `Fast solutions`).
  - `Tutor service` (`50k verified expert`, `98.5% satisfaction rate`, `Solves the top 5% most difficult problems`, `Solutions within as little as 5 minutes`).
  - Community ratings (`4.8 (1.9M)` on Google Play & App Store) and student testimonials.

### 3.3 Gauth Academy (`/course/*`)
- **Category Tabs & `+ Create Course` CTA**:
  - **Science Labs (`/course/science`)**: 12 interactive courses across 4 disciplines:
    - *How Things Work*: `The Sweet Spot`, `Bending the Light`, `How Noise-Cancelling Headphones Work`
    - *Biology*: `Golgi Apparatus and Protein Sorting`, `Cell Membrane and Transport`, `Chloroplasts and Photosynthesis`
    - *Chemistry*: `Atomic Number and Element Identity`, `Alkali Metal Trends Down a Group`, `Trends Across Period 3`
    - *Medicine (Nursing)*: `Heart Pumps and Blood Circulation`, `Coronary Blood Supply`, `Diaphragm Movement and Inhalation`
  - **Math Curriculum (`/course/math` & `/course/math/[curriculum]`)**:
    - *Algebra 1* (`20 Units · 77 Lessons · 599 Topics`) with expandable `Show 14 more` toggle and unit detail view (`/course/math/algebra-1?unit=...`).
    - *Algebra 2* (`20 Units · 67 Lessons · 510 Topics`) with expandable `Show 14 more` toggle and unit detail view.
    - *Geometry* (`21 Units · 61 Lessons · 479 Topics`) with expandable `Show 15 more` toggle and unit detail view.
  - **History Signature (`/course/history`)**: 8 signature visual courses:
    - `Smoke, Steam, and Progress` (The Industrial Revolution)
    - `Crossing the Ocean Wall` (The Age of Exploration)
    - `Four Fuses and a Spark` (The Outbreak of World War I)
    - `The Price of Ending War` (The Pacific War)
    - `From Samurai to Smoke` (Meiji Restoration)
    - `From Versailles to Warsaw` (The Outbreak of World War II)
    - `Chasing Silver Across Seas` (Global Silver Trade)
    - `From Lies to the Trenches` (The Road to World War I)
  - **My Course (`/course/my`) & AI Course Creator Modal**:
    - Empty state (`Build AI courses from any topic · Click Create to build lessons`) + list of user-created AI courses.
    - `Create a Course` modal: prompt input (`What would you like to study?`), suggested topic chips (`Perimeter and Area of Rectangles`, `Rocks, Minerals and the Rock Cycle`, `Goods and Services`) with `Shuffle` button, and `Remaining uses today: 3` counter.
  - **Interactive Course Lesson Player (`/course/[category]/[slug]/learn`)**:
    - Audio permission prompt (`Enable audio to continue` -> `Not now` / `Enable audio`).
    - Interactive pan-and-zoom simulation canvas (`Drag to pan · Ctrl/⌘ + scroll to zoom`) with interactive parameters, diagrams, and quick check quizzes.
    - Chapter/block navigation (`Previous block`, `Play`/`Pause`, `Next block`, chapter outline sidebar).
    - Settings popover (`Speed 1x`, `Narration`, `Captions`, `Zoom out / 100% / Zoom in`, `Export PDF`).
    - Contextual `Ask Tutor` bar with text and voice input (`Ask by voice`).

### 3.4 Gauth Atlas (`/atlas`, `/atlas/world_map`, `/atlas/session/[id]`)
- **Atlas Hub (`/atlas`)**:
  - Collapsible topic drawer (`+ New Topic`, `Search...`, saved session history).
  - Visual story prompt composer (`Enter a topic, place, person, event, or story…`, `Search` web grounding toggle, submit button).
  - Featured banner: `NEW · Interactive AP US History Map · Explore events, timelines, and connections across U.S. history -> /atlas/world_map`.
  - `Popular Stories` grid:
    - 6 Video Stories (`Apollo 11 Moon Mission Journey`, `Zhuge Liang: Chancellor of Shu Han`, `The Manila Galleon Trade Route`, `The Normandy Landings of D-Day`, `The First Industrial Revolution`, `Age of Discovery and Maritime Exploration`).
    - 13 Interactive Story Sessions (`Empires of the Silk Roads`, `Mongol Expansion and Eurasian Connection`, `Artemis II Mission Overview`, `Westward Expansion and Manifest Destiny`, `The Pacific War and the U.S. in WWII`, `Martin Luther King Jr. and the Civil Rights Movement`, `First Time in Milan Travel Map`, `The Roman Empire and Its Infrastructure`, `Atlantis: The Legendary Island Civilization`, `The Ancient City of Babylon`, `Life and Legacy of Albert Einstein`, `Giant Panda Infographic`, `Rosa Parks and the Montgomery Bus Boycott`).
  - Expandable FAQ accordion (`Frequently Asked Questions`).
- **Interactive AP US History World Map (`/atlas/world_map`)**:
  - Interactive map canvas with timeline year scrubber (`1490` – `2026`, default `1877`), zoom controls, and interactive regional pins.
  - Category filter chips: `Person`, `Politics`, `Economy`, `Other`.
  - `Knowledge Library` POI drawer (`Featured` vs `Mine` tabs, `Search by title or region...`, historical knowledge points with detailed summaries, locations, and year spans, plus ability to add custom study POIs under `Mine`).
- **Atlas Visual Story Session (`/atlas/session/[id]`)**:
  - Spatial visual story canvas with `View` and `Details` modes, thumbnail filmstrip navigation, and deep-dive story chapters (e.g., `The Crucible's Breath`, `Alchemy of Cobalt`, `The Vitrification Shield`, `A Legacy of Permanence`).
  - `Generate Video` popover with `SOURCE IMAGES` selector, `VOICEOVER LANGUAGE` selector (16 languages), and interactive video preview player.
  - `Share` link copy & `New Topic` creation.

### 3.5 Resources, Upgrade (Plus), App Download, and Legal Pages
- **Resources (`/news`, `/blog`, `/blog/[slug]`, `/trust-center`)**:
  - `/news`: Press & media coverage cards (Yahoo Finance, Fast Company, EdTech Digest, Forbes, TechRadar, PR Newswire) + pagination.
  - `/blog` & `/blog/[slug]`: Study guides & reference articles (`Algebra 2: Key Concepts, Examples, and Study Guide`, `Geometry Formulas: Complete Reference for Students`, `Geometric Shapes`, `Algebra 2 Practice`, `Algebra 2 Review`, etc.) with category pagination.
  - `/trust-center`: Official safety, privacy, age policy, and feature overview (`Gauth Atlas`, `AI Course`, `Flashcard`, `Quizify`, `AI Tutor`).
- **Gauth PLUS (`/plus`)**:
  - Plan comparison (`Free Plan` vs `Gauth PLUS`) and interactive subscription checkout modal (`1 Month S$6.99`, `3 Months S$16.99 with 3-Day Free Trial`, `12 Months S$43.99 -30%`).
- **Mobile App Download (`/download`) & Company/Legal (`/aboutus`, `/honor`, `/policy`, `/terms`, `/writing-examples`)**:
  - Full content parity with the live site.
