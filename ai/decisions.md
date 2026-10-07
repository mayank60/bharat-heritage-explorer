# Architecture & Technical Decisions Record: Bharat Heritage Explorer

This document catalogs the major architectural and design decisions identified during deep code analysis of the **Bharat Heritage Explorer** repository.

---

### Decision 1: Full-Stack Express Server with Vite Dev Middleware (`server.ts`)
- **Decision:** Use a single Node.js script (`server.ts`) executing with `tsx` to serve both the Express REST API and Vite development middleware.
- **Why it appears to have been made:** Avoids running separate frontend and backend ports in development, simplifies proxy routing, and enables single-command startup (`npm run dev`).
- **Current Implementation:** `server.ts` creates an Express app, registers `/api/*` endpoints, and in development imports `vite.createServer({ server: { middlewareMode: true }, appType: 'spa' })` mounting `vite.middlewares`.
- **Files Affected:** `server.ts`, `package.json`.
- **Known Trade-offs:** Node.js process manages both build transforms and API requests; in high-traffic production, dedicated static asset CDNs are preferred.
- **Evidence / Source:** `package.json` line 7: `"dev": "tsx server.ts"`; `server.ts` lines 396–414.
- **Verification Status:** Verified from code.

---

### Decision 2: Client-Side Seed Data with Graceful API Fallbacks
- **Decision:** Include full geographic, monument, culinary, and linguistic seed datasets directly in TypeScript files under `src/data/`.
- **Why it appears to have been made:** Ensures the web app remains 100% functional even when deployed to pure static hosting platforms (such as Netlify, Vercel, or GitHub Pages) where the Node.js Express server is not running.
- **Current Implementation:** When frontend fetch calls to `/api/*` encounter network errors or 404s, catch blocks automatically fall back to `STATES`, `HERITAGE_ITEMS`, `FOODS`, `FESTIVALS`, and `LANGUAGES` in `src/data/seedDatabase.ts`.
- **Files Affected:** `src/App.tsx`, `src/components/KageLandingPage.tsx`, `src/components/StateSidePanel.tsx`, `src/data/seedDatabase.ts`.
- **Known Trade-offs:** Increases initial JavaScript bundle size (~500KB of rich cultural content) in exchange for zero-latency offline exploration and static portability.
- **Evidence / Source:** `src/App.tsx` lines 112–165; `src/components/KageLandingPage.tsx` lines 49–65.
- **Verification Status:** Verified from code.

---

### Decision 3: Local SQLite Database Persistence for Visitor Sessions
- **Decision:** Use an embedded SQLite3 database (`backend/bharat_darshan.db`) managed via `backend/database.py` for logging visitor passes and sessions.
- **Why it appears to have been made:** Provides real, zero-configuration disk persistence for user login records without requiring heavy cloud database provisioning.
- **Current Implementation:** `server.ts` handles `/api/login` and executes `backend/database.py` via `child_process.execFileSync` while maintaining an in-memory array for instant client response.
- **Files Affected:** `server.ts`, `backend/database.py`, `backend/bharat_darshan.db`, `src/components/UserLoginModal.tsx`.
- **Known Trade-offs:** Requires `python3` with standard `sqlite3` on the host environment; synchronous execution can add latency under heavy concurrent logins.
- **Evidence / Source:** `server.ts` lines 242–248; `backend/database.py` lines 1–60.
- **Verification Status:** Verified from code.

---

### Decision 4: Tailwind CSS v4 with Custom Dark Mode Variant & Light Mode Fallbacks
- **Decision:** Adopt Tailwind CSS v4 (`@import "tailwindcss";`) with `@custom-variant dark (&:where(.dark, .dark *));` coupled with global theme overrides.
- **Why it appears to have been made:** Leverages the latest high-performance Tailwind engine while maintaining clean toggleability between royal ivory (Light) and dark obsidian (Dark) aesthetics.
- **Current Implementation:** `src/index.css` defines base rules for `html:not(.dark)` and `html.dark`, overriding backgrounds, borders, and typography so that all cards, heroes, and dialogs dynamically switch.
- **Files Affected:** `src/index.css`, `src/App.tsx`, `src/components/Navbar.tsx`, `src/components/KageLandingPage.tsx`, `src/components/StateCategoryExplorer.tsx`, `src/components/BrandLogo.tsx`.
- **Known Trade-offs:** Requires deliberate styling discipline to ensure text colors contrast against both ivory and obsidian backgrounds.
- **Evidence / Source:** `src/index.css` lines 1–65; `src/App.tsx` lines 94–105.
- **Verification Status:** Verified from code.

---

### Decision 5: Complete Bilingual Localization Dictionary (`en` and `hi`)
- **Decision:** Build a native bilingual localization system without heavy third-party i18n libraries.
- **Why it appears to have been made:** Maximizes cultural authenticity for Indian national heritage discovery while keeping runtime overhead near zero.
- **Current Implementation:** `src/i18n.ts` provides structured UI key-value pairs; `src/data/hindiDescriptions.ts` provides deep curatorial narratives for all monuments, arts, foods, and festivals.
- **Files Affected:** `src/i18n.ts`, `src/data/hindiDescriptions.ts`, all components in `src/components/`.
- **Known Trade-offs:** Requires manual curation for new heritage additions in both languages.
- **Evidence / Source:** `src/i18n.ts`, `src/data/hindiDescriptions.ts`.
- **Verification Status:** Verified from code.

---

### Decision 6: Standalone Single-File Distribution Bundle Generator
- **Decision:** Maintain a specialized Node.js script (`scripts/bundle-standalone.cjs`) that bundles HTML, CSS, and JS into an offline `standalone.html` file.
- **Why it appears to have been made:** Allows educational institutions, museums, and judges to run the complete platform completely offline by opening a single HTML file in any browser.
- **Current Implementation:** Running `npm run build` executes `vite build` followed by `node ./scripts/bundle-standalone.cjs`.
- **Files Affected:** `scripts/bundle-standalone.cjs`, `package.json`, `index.html`.
- **Known Trade-offs:** Generates a large standalone HTML file (> 1.5MB) containing inlined scripts.
- **Evidence / Source:** `package.json` line 8; `scripts/bundle-standalone.cjs`.
- **Verification Status:** Verified from code.

---

### Decision 7: Browser-Native Web Speech API for Classical Language Greetings
- **Decision:** Utilize the browser's native `window.speechSynthesis` API for reading traditional state greetings.
- **Why it appears to have been made:** Enables interactive audio pronunciation without hosting heavy audio MP3 files or relying on external cloud TTS subscriptions.
- **Current Implementation:** `handleSpeakGreeting()` in `src/components/StateCategoryExplorer.tsx` configures a `SpeechSynthesisUtterance` with `utterance.lang = 'hi-IN'`.
- **Files Affected:** `src/components/StateCategoryExplorer.tsx`.
- **Known Trade-offs:** Voice quality and availability of Indian regional accents depend on the user's browser and operating system.
- **Evidence / Source:** `src/components/StateCategoryExplorer.tsx` lines 212–225.
- **Verification Status:** Verified from code.

---

### Decision 8: Passcode-Protected Administrative Portal (`asi@bharat`)
- **Decision:** Provide a curatorial management console protected by a passcode for the Archaeological Survey of India (ASI) administrators.
- **Why it appears to have been made:** Enables curators to audit datasets, verify heritage counts, and submit new monuments without complex OAuth configurations during initial demonstrations.
- **Current Implementation:** Verified both via API endpoint `POST /api/admin/verify` and in `src/components/AdminModal.tsx`.
- **Files Affected:** `server.ts`, `src/components/AdminModal.tsx`, `src/components/AddHeritageModal.tsx`.
- **Known Trade-offs:** Passcode is shared and hardcoded; production environments would require full multi-user authentication with RBAC.
- **Evidence / Source:** `server.ts` lines 265–275; `src/components/AdminModal.tsx` line 46.
- **Verification Status:** Verified from code.
