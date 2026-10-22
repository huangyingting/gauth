# Feature-Parity Matrix — Original `https://www.gauth.com` vs Replicated Application

| Feature Area | Original `gauth.com` Route | Reference Screenshot(s) | Replicated Route & Component | Status |
|---|---|---|---|---|
| **Homework AI Study Helper** | `/` | `01-home-desktop.png`, `01b-home-clean.png`, `31-homework-input-filled.png`, `34-mobile-home.png` | `src/app/page.tsx` | 100% Parity |
| **Step-by-Step AI Question Solution** | `/search-question` | `32-homework-question-solution.png`, `32-homework-question-solution-full.png` | `src/app/search-question/page.tsx` + `POST /api/homework/solve` | 100% Parity |
| **Academy — Science Labs (12 Courses)** | `/course/science` | `02-academy-science.png`, `35-mobile-academy.png` | `src/app/course/science/page.tsx` | 100% Parity |
| **Academy — Math Curriculum (Algebra 1, Algebra 2, Geometry: 61 Units, 205 Lessons)** | `/course/math`, `/course/math/[curriculum]` | `08-academy-math.png`, `25-academy-math-expanded.png`, `26-academy-math-unit-detail.png`, `37-math-algebra-1.png`, `37-math-algebra-2.png`, `37-math-geometry.png` | `src/app/course/math/page.tsx`, `src/app/course/math/[curriculum]/page.tsx` | 100% Parity |
| **Academy — History Signature (8 Courses)** | `/course/history` | `09-academy-history.png`, `14-academy-history-clean.png` | `src/app/course/history/page.tsx` | 100% Parity |
| **Academy — My Course & AI Course Creator Modal** | `/course/my` | `10-academy-my-course.png`, `15-academy-my-clean.png`, `27-academy-create-course-modal.png` | `src/app/course/my/page.tsx` + `POST /api/courses/create` | 100% Parity |
| **Interactive Course Lesson Player** | `/course/[category]/[slug]/learn` | `16-course-player-science-1.png`, `17-course-player-biology-1.png`, `28-course-player-active-canvas.png`, `29-course-player-next-block.png` | `src/app/course/[category]/[slug]/learn/page.tsx` + `POST /api/courses/tutor` | 100% Parity |
| **Gauth Atlas Hub & Popular Stories (6 Videos + 13 Sessions + FAQ)** | `/atlas` | `03-atlas.png`, `18-atlas-clean.png`, `36-mobile-atlas.png` | `src/app/atlas/page.tsx` | 100% Parity |
| **Atlas — Interactive AP US History World Map (152 POIs + Timeline)** | `/atlas/world_map` | `19-atlas-world-map.png` | `src/app/atlas/world_map/page.tsx` + `/api/atlas/pois` | 100% Parity |
| **Atlas — Spatial Story Session & 16-Language Video Generator** | `/atlas/session/[id]` | `20-atlas-session-silk-roads.png` | `src/app/atlas/session/[id]/page.tsx` + `/api/atlas/sessions` | 100% Parity |
| **Resources — News, Blog & Trust Center** | `/news`, `/blog`, `/trust-center` | `04-resources-news.png`, `11-resources-blog.png`, `22-resources-blog.png`, `24-resources-trust-center.png` | `src/app/news/page.tsx`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/trust-center/page.tsx` | 100% Parity |
| **Gauth PLUS Subscription & Quota System** | `/plus` | `06-plus.png` | `src/app/plus/page.tsx` + `POST /api/plus/subscribe` | 100% Parity |
| **Mobile App Download Page** | `/download` | `05-download.png` | `src/app/download/page.tsx` | 100% Parity |
| **Company & Legal Pages** | `/aboutus`, `/honor`, `/policy`, `/terms`, `/writing-examples` | `07-aboutus.png`, `13-honor.png`, `21-policy.png`, `23-terms.png` | `src/app/aboutus/page.tsx`, `src/app/honor/page.tsx`, `src/app/policy/page.tsx`, `src/app/terms/page.tsx`, `src/app/writing-examples/page.tsx` | 100% Parity |
| **Invite-Only Auth, RBAC, Revocation & CLI Admin Bootstrap** | Production Enterprise Extension (`../Arcade` reference) | Verified via automated tests & E2E | `/auth/signin`, `/invite/[token]`, `/admin/invitations`, `npm run bootstrap:admin` | 100% Parity |
