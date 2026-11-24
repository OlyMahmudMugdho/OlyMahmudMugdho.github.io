# AGENTS.md — Portfolio & Blog Guidelines

This file documents the conventions, structure, and workflows for `/home/mugdho/codes/portfolio`.

## Project Overview

- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui (`components/ui/`).
- **Blog content:** Markdown files under `content/blog/` parsed by `lib/blog.ts` (`gray-matter`, `remark`, `rehype-highlight`).
- **Courses content:** JSON curriculum definitions under `content/courses/` parsed by `lib/courses.ts`.
- **Card & Header Themes:** Shared color palette and slug-based visual helpers in `lib/card-themes.ts` (uses explicit inline hex `style` attributes so colors are never purged).

---

## Adding LeetCode / NeetCode 150 Articles

When syncing solutions from `/home/mugdho/codes/neetcode-150`:

1. **Git-Tracked Only:**
   - Check `git status` / `git log` in `/home/mugdho/codes/neetcode-150`.
   - **Never** create blog articles for untracked (`??`) problem folders in `neetcode-150`. Only include problems that are committed/tracked in git.

2. **Bilingual Files (`article.md` + `article.bn.md`):**
   - Place English articles at `content/blog/neetcode-150/<problem-slug>/article.md`.
   - Place Bengali translations at `content/blog/neetcode-150/<problem-slug>/article.bn.md`.
   - `lib/blog.ts` automatically excludes `*.bn.md` from `getPostSlugs()` and loads `article.bn.md` when the user toggles the `English` / `বাংলা` selector in `components/blog/blog-post-view.tsx`.

3. **Frontmatter Format:**
   ```yaml
   ---
   title: "Problem Title"
   date: "YYYY-MM-DD"
   excerpt: "Concise one-sentence summary of the problem and approach."
   category: "Coding"
   tags: ["coding", "dsa", "interview", "neetc-150"]
   featured: false
   author: "M. Oly Mahmud"
   ---
   ```
   - Omit `coverImage` if no real image exists (do not invent URLs). `components/blog/post-card.tsx` automatically renders a colored geometric medallion + emoji fallback for posts without a `coverImage`.

4. **Required Article Structure & Section Order:**
   Articles must explain the user's actual solution from `neetcode-150` in this order:
   1. Problem Statement & Examples
   2. `# Easy Explanation` / `# The Main Idea`
   3. `# Decision Tree` (ASCII text diagram — required for backtracking and branching problems)
   4. `# Algorithm` (numbered steps + pseudocode block) — **must come before** Dry Run and Code
   5. `# Step-by-Step Dry Run` — **must come before** Code
   6. `# Understanding the Code` (the Python solution)
   7. `# Time Complexity` & `# Space Complexity`
   8. `# The Pattern to Remember`

5. **Bengali Translation Rules (`article.bn.md`):**
   - Use a **natural, conversational Bangla tone** (explaining to a fellow developer), not literal/robotic textbook phrasing.
   - **Always use ASCII digits (`1.`, `2.`, `3.`) for Markdown ordered lists**—never Bengali numerals (`১.`, `২.`, `৩.`), because `remark` / CommonMark does not parse Bengali numerals as lists and collapses them into a single `<p>` paragraph.
   - Ensure a blank line before every list.

---

## Courses System

- Course definitions live in `content/courses/<course-slug>.json` with `title`, `description`, `level`, `tags`, and `units` (each unit has `id`, `title`, `description`, and `lessons` with `title` and `slug`).
- An article may belong to a course or remain standalone; `getCourseContextForPost()` in `lib/courses.ts` automatically attaches course/unit breadcrumbs and Previous/Next lesson navigation when an article is part of a course.
- When adding new `neetcode-150` articles, add them to the matching unit (or a new unit) in `content/courses/neetcode-150-dsa.json`.

---

## Verification

Before finishing any code or content change, run:

```bash
npm run build
```

Verify that TypeScript type-checking passes and all static pages generate without errors.
