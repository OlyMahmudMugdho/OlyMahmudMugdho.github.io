# Paper Theme Design

## Intent & Why
Add a selectable **"Paper"** theme to the portfolio's theme switcher inspired by the warm, tactile notebook aesthetic of `designed-to-scale.vercel.app` (warm cream paper canvas, crisp dark ink outlines, soft pastel accents, monospace typography, and subtle hard offset shadows).

## Goals & Non-Goals
- **Goals:**
  - Expose `"paper"` alongside `"light"`, `"dark"`, and `"system"` in `next-themes` and `ThemeToggle`.
  - Apply the full tactile notebook aesthetic when `.paper` is active across the portfolio (`/`), `/blog`, `/courses`, and `/resume`.
  - Preserve existing `light` and `dark` themes completely unchanged, and keep `system` as the default theme.
  - Respect `/blog` Reading Settings font overrides (especially Bengali fonts and custom EN fonts).
- **Non-Goals:**
  - Redesigning page layouts, diagrams, or course/blog banner art (`lib/card-themes.ts`).
  - Replacing the existing Light mode or changing the default theme.

## Approaches Considered
1. **Palette & Borders Only (CSS variables):** Override only shadcn HSL variables under `.paper`. Lowest risk, but feels like a warm light mode rather than the tactile screenshot aesthetic.
2. **Full Tactile Notebook Aesthetic (Selected):** Override shadcn HSL variables under `.paper`, load a crisp monospace font (`IBM Plex Mono`) via `next/font/google`, and add scoped `.paper` rules for tactile ink borders, hard offset shadows on buttons/cards/badges, and a subtle paper grid texture. Chosen because it faithfully captures the reference screenshot as a distinct theme mode.

## Design Summary
- **Theme Registration (`app/layout.tsx`):**
  - Load `IBM_Plex_Mono` (weights `400`, `500`, `600`, `700`) with CSS variable `--font-paper-mono` and attach it to `<html>`.
  - Update `ThemeProvider` to `themes={["light", "dark", "paper"]}`, keeping `defaultTheme="system"` and `enableSystem`.
- **Theme Switcher (`components/theme-toggle.tsx`):**
  - Add a **Paper** option to the dropdown menu with a `NotebookPen` (or `BookOpen`) icon, and reflect the active theme icon on the trigger button (sun for light, moon for dark, notebook icon for paper; hydration-safe via mounted check or CSS class visibility).
- **Color Palette & Tokens (`app/globals.css` under `.paper`):**
  - `--background`: warm cream `#FAF6EE` (`39 50% 96%`)
  - `--card` / `--popover`: crisp warm ivory `#FFFDF8` (`43 100% 99%`)
  - `--foreground` / `--card-foreground`: warm ink `#1A1816` (`30 8% 9%`)
  - `--primary`: soft mint green `#C7F2A7` (`94 74% 80%`) with `--primary-foreground`: `#1A1816`
  - `--secondary`: soft lavender `#ECE4F9` (`263 64% 94%`) with `--secondary-foreground`: `#1A1816`
  - `--muted`: warm stone `#F0E9DC` (`39 38% 90%`) with `--muted-foreground`: `#5C554C` (`34 10% 33%`)
  - `--accent`: soft butter yellow `#FDF2C6` (`48 93% 88%`) with `--accent-foreground`: `#1A1816`
  - `--border` / `--input`: warm stone `#D5CBC0` (`31 19% 79%`), `--ring`: `#1A1816`
- **Tactile Notebook Styling (`app/globals.css` scoped to `.paper`):**
  - Apply `font-family: var(--font-paper-mono), ui-monospace, monospace` on `.paper body` (blog article content inline `fontFamily` continues to override cleanly).
  - Subtle warm graph-paper grid background on `.paper body`.
  - Add lightweight `data-paper-card`, `data-paper-btn`, and `data-paper-badge` hooks (or clean `.paper` selectors on shadcn `Card`, `Button`, `Badge`) for crisp `1.5px` ink borders (`#1A1816`) and hard offset shadows (`2px 2px 0 #1A1816`) with a tactile press transition on primary/outline buttons.
- **Verification:**
  - Run `npm run build` to verify TypeScript and Next.js static generation succeed cleanly.
