# AI Engineering Instructions & Project Rules: Bharat Heritage Explorer

This document establishes the official instructions, architectural constraints, and coding conventions that all future AI agents and software engineers must follow when working on the **Bharat Heritage Explorer** (Bharat Darshan) codebase.

---

## 1. Project-Specific Rules & Operational Constraints

1. **Do Not Break Full-Stack Architecture:**
   - The primary application runtime is a full-stack Node.js + Express + Vite setup driven by `server.ts`.
   - In development, `server.ts` mounts Vite's SPA middleware (`vite.middlewares`). Do **not** attempt to mount Express inside `vite.config.ts`.
   - Production serving serves prebuilt assets from `dist/` or `standalone.html`.

2. **Port Configuration:**
   - The server must listen on `process.env.PORT` or default to `3000` with host `0.0.0.0`.
   - Never hardcode alternative ports (e.g. 5000, 8080) for the main application entry point.

3. **No External Mock Data When Live Data Is Seeded:**
   - All 36 States and Union Territories and 140+ heritage items are seeded in `src/data/seedDatabase.ts`, `src/data/allStatesData.ts`, and `src/data/hindiDescriptions.ts`.
   - Always prefer these verified records and official ASI data rather than inventing random mock items.

4. **Preserve Bilingual Support (Hindi + English):**
   - Every user-facing UI component must support both English (`en`) and Hindi (`hi`) using `lang: LanguageKey` and `TRANSLATIONS[lang]` from `src/i18n.ts`.
   - Cultural descriptions should query the curatorial helpers in `src/data/hindiDescriptions.ts`.

5. **Theme Integrity (Dark & Light Mode):**
   - Theme state is managed globally via `darkMode` state in `src/App.tsx`, synchronized with `document.documentElement.classList` (`.dark`) and `localStorage.getItem('bharat_heritage_dark')`.
   - All newly added components, modals, and elements **must** support both Light Mode (warm ivory `#FAF7F2` background, rich stone typography `#1C1917`) and Dark Mode (deep obsidian `#05070A` background, ivory text `#DFE7E0`).
   - Never use raw unconditioned `text-white` on backgrounds that become light in Light Mode. Always use `text-stone-900 dark:text-white` or similar responsive utility pairs.

---

## 2. Architecture Constraints & Coding Conventions

- **Frontend Framework:** React 19 SPA with TypeScript. Functional components with React hooks exclusively.
- **Styling:** Tailwind CSS v4 using `@import "tailwindcss";` in `src/index.css`.
  - Dark mode selector variant is declared as `@custom-variant dark (&:where(.dark, .dark *));`.
  - Avoid separate arbitrary CSS stylesheets; maintain global theme variables and utility overrides in `src/index.css`.
- **Iconography:** Use `lucide-react` icons. Maintain visual consistency with existing icons (`Landmark`, `Compass`, `Bookmark`, `Sparkles`, `Utensils`, `Languages`, `Palette`).
- **Typography:**
  - Display / Headings: `Cinzel`, Georgia, serif (configured via class `font-serif`).
  - Body / UI Prose: `Plus Jakarta Sans`, system-ui, sans-serif (configured via class `font-sans`).
- **Responsive Layout Breakpoints:**
  - Standard card grids must use responsive multi-tier breakpoints (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) to guarantee full visibility on mobile viewports (< 768px).

---

## 3. Files & Modules Requiring Extra Caution

- **`server.ts`:**
  - Core API router, static asset server, and Vite dev middleware runner.
  - Modifying route paths or response structures will break client fetch calls.
- **`src/data/seedDatabase.ts` & `src/data/hindiDescriptions.ts`:**
  - Canonical repository containing all geographic coordinates, UNESCO flags, dynasties, and authentic Hindi cultural translations.
  - Do not truncate or corrupt data structures.
- **`src/components/StateCategoryExplorer.tsx`:**
  - The central interaction hub for 36 states and 6 cultural categories. Ensure responsive padding and grid structures are maintained.
- **`src/components/BrandLogo.tsx`:**
  - Complex custom SVG medallion with dual-theme typography lockup.
- **`src/index.css`:**
  - Contains global fallback theme rules for `html:not(.dark)` and `html.dark`.

---

## 4. Security-Sensitive Areas & Approval Requirements

- **Administrative Console Passcode:**
  - Verified against passcode `asi@bharat` in `server.ts` (`/api/admin/verify`) and `src/components/AdminModal.tsx`.
  - Do not change or expose this administrative passcode without explicit user confirmation.
- **Visitor Pass / User Login:**
  - Sessions are saved in SQLite (`backend/bharat_darshan.db`) via `backend/database.py` and mirrored in memory and browser `localStorage`.
  - No plain-text passwords or sensitive user data should be recorded.

---

## 5. Testing & Verification Protocol

Before completing any engineering task, the agent must perform:
1. `lint_applet` (or `npm run lint` / `tsc --noEmit`) to verify 0 syntax or type errors.
2. `compile_applet` (or `npm run build`) to ensure Vite compiles successfully and the standalone bundle is generated.
3. Test dev server response at `http://localhost:3000` to verify API health.
