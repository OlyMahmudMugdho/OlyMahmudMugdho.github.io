# AGENTS.md

## Nature of the Project
Personal portfolio for **M. Oly Mahmud** (Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui) with three core parts:
- **Portfolio (`/`):** Showcase of experience, education, projects, courses, dev.to articles, certifications, skills, and contact.
- **Blog (`/blog`):** Markdown technical articles (`content/blog/`) with search, category/tag filtering, pagination, optional Bengali translations (`article.bn.md`), and persistent reading settings (per-language fonts + font size).
- **Courses (`/courses`):** Curated learning paths (`content/courses/*.json`) grouping blog articles into `units` and ordered `lessons`. Articles may belong to a course or remain standalone.

## Blog Categories & Tags
- **Categories:** `Coding`, `Cloud`, `DevOps`, `Frontend`
- **Common Tags:** `coding`, `dsa`, `interview`, `neetc-150`, `Blind75`, `aws`, `cloud`, `introduction`, `nextjs`, `react`, `rsc`, `deployment`, `vercel`

## Directory & File Responsibilities
- `app/layout.tsx`, `app/page.tsx`, `app/resume/page.tsx`: Root layout (`Inter`, theme provider), homepage sections, and resume page.
- `app/blog/`: `layout.tsx` (Inconsolata + Google Fonts stylesheet), `page.tsx` (blog index), `[...slug]/page.tsx` (renders EN/BN post + course context).
- `app/courses/`: `layout.tsx`, `page.tsx` (courses grid), `[slug]/page.tsx` (hero banner + unit/lesson curriculum).
- `app/api/`: `blog/assets/[...path]/` serves local post images; `contact/route.ts` handles contact submissions.
- `components/navbar.tsx`, `components/sections/*`: Top navigation and homepage sections (`courses.tsx`, `articles.tsx`, etc.).
- `components/blog/`: `blog-post-view.tsx` (EN/বাংলা toggle, Reading Settings popover, course prev/next), `post-card.tsx` (colored medallion + emoji fallback when `coverImage` is absent), `blog-list-client.tsx`, `blog-filters.tsx`, `search-bar.tsx`, `pagination.tsx`.
- `components/courses/course-card.tsx`: Course card + `getCourseVisual(index)` helper (renders the course cover: inline-hex colored banner, 12-sided geometric medallion, and icon; also drives the course detail hero banner and cycling colored unit headers).
- `components/ui/`: Reusable shadcn/ui primitives.
- `lib/blog.ts`: Loads `content/blog/` via `gray-matter` + `remark`, excludes `*.bn.md` from `getPostSlugs()`, strips leading `# Title` to prevent duplicate `<h1>`.
- `lib/courses.ts`: Loads `content/courses/*.json`, resolves lesson metadata, provides `getCourseContextForPost()`.
- `lib/card-themes.ts`: Shared inline-hex banner palette (`CARD_THEMES`) used for course covers, unit headers, blog post headers, and `getPostVisual(slug)` emoji/color fallbacks on blog cards without `coverImage`.
- `content/blog/`: Markdown posts (`<slug>/article.md` + optional `article.bn.md`, or `<slug>.md`).
- `content/courses/`: Course JSONs (`title`, `description`, `level`, `tags`, `units[]` with `lessons[]`).
- `data/`: Static JSON (`badges.json`, `projects.json`).

## Rules for Adding NeetCode 150 / LeetCode Articles
1. **Git-Tracked Only:** Sync from `/home/mugdho/codes/neetcode-150`; **never** add untracked (`??`) problems.
2. **Bilingual Pairs:** Create both `article.md` and `article.bn.md` under `content/blog/neetcode-150/<slug>/`.
3. **Frontmatter:** Standard `---` YAML with `title`, `date` (`YYYY-MM-DD`), `excerpt`, `category: "Coding"`, `tags: ["coding", "dsa", "interview", "neetc-150"]`, `featured: false`, `author: "M. Oly Mahmud"`. Omit `coverImage` if none exists.
4. **Section Order:** Problem & Examples → Easy Explanation → Decision Tree (ASCII diagram for backtracking/branching) → Algorithm (steps + pseudocode) → Step-by-Step Dry Run → Understanding the Code (user's solution) → Complexity → Pattern.
5. **Content Tone:** Friendly, beginner-accessible, and conversational—like a peer developer explaining at a whiteboard (motivation before optimization, intuitive analogies, gentle notes on improvements), never stiff or robotic.
6. **Bengali (`article.bn.md`):** Natural everyday Bangla developer phrasing (keep standard English tech terms like `set`, `stack`, `O(n)` where natural). Always use ASCII digits (`1.`, `2.`, `3.`) for ordered lists (never `১.`, `২.`), with a blank line before lists.
7. **Courses & Verification:** Register new lessons in `content/courses/neetcode-150-dsa.json`, then run `npm run build` to verify types and static pages.
