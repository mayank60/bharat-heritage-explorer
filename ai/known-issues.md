# Known Issues, Risks & Technical Debt Audit: Bharat Heritage Explorer

This document registers currently discovered problems, inconsistencies, performance risks, and technical debt across the codebase as verified during the project audit.

---

### Issue 1: Dual Backend Runtime Coupling (Node.js Express + Python 3 / SQLite)
- **Severity:** Low
- **Status:** ✅ RESOLVED. `server.ts` uses native `node:sqlite` (`DatabaseSync`) for microsecond-latency database queries in the Node.js event loop without blocking or spawning external processes.

---

### Issue 2: Standalone Python Flask Server (`backend/app.py`) Lacks Flask Dependency
- **Severity:** Low
- **Status:** ✅ RESOLVED. `backend/app.py` now provides a dual-engine architecture: it automatically runs with Flask + Flask-CORS when installed, or seamlessly switches to Python 3's built-in `http.server` with zero external dependencies. Both engines serve 100% of the Bharat Darshan API endpoints (`/api/states`, `/api/heritage`, `/api/health`, `/api/login`, `/api/users`, etc.) backed by `bharat_darshan.db`.

---

### Issue 3: In-Memory Mutation of Admin-Contributed Heritage Items
- **Severity:** Low
- **Status:** ✅ RESOLVED. Admin and community-submitted heritage items are persisted directly to the SQLite `community_heritage` table across restarts and loaded into the active catalog automatically.

---

### Issue 4: Hardcoded Administrative Passcode in Client and Server
- **Severity:** Medium
- **Evidence:** `server.ts` line 268 verifies `passcode === 'asi@bharat'`; `src/components/AdminModal.tsx` line 46 verifies `passcode.trim() === 'asi@bharat'`.
- **Affected Area:** ASI Administrative Portal (`AdminModal.tsx`, `server.ts`).
- **Current Behavior:** The administrative verification key is hardcoded directly into source files.
- **Expected Behavior:** Passcodes or administrative secrets should be loaded from environment variables (e.g., `process.env.ASI_ADMIN_PASSCODE` in `.env`) and verified strictly via server-side hash verification.
- **Possible Impact:** Passcode is visible in client-side bundle source code.
- **Status:** Documented / Security Risk.
- **Recommended Next Investigation / Fix:** Move the passcode to server-side environment variables and remove client-side hardcoded comparisons.

---

### Issue 5: Large Seed Dataset Embedded in Client JavaScript Bundle
- **Severity:** Low
- **Evidence:** `src/data/seedDatabase.ts` and `src/data/hindiDescriptions.ts` comprise several thousand lines of text data bundled into client assets.
- **Affected Area:** Initial bundle size and Time-to-Interactive (TTI).
- **Current Behavior:** All 36 states, 140+ monuments, dozens of foods, festivals, and language records are packaged into the main client bundle.
- **Expected Behavior:** Data could be loaded on-demand per state via lazy chunking or dynamic fetch queries to `/api/states/:id`.
- **Possible Impact:** Slightly slower initial load on low-bandwidth mobile connections, though mitigated by rapid subsequent navigation.
- **Status:** Architectural Trade-off (chosen intentionally to enable 100% offline and static deployment capability).
- **Recommended Next Investigation / Fix:** Consider splitting state datasets into dynamic lazy-loaded JSON chunks if the repository expands beyond 500+ records.

---

### Issue 6: Unused `leaflet` and `@types/leaflet` Dependencies
- **Severity:** Low
- **Evidence:** `package.json` lines 17 and 21 include `leaflet` and `@types/leaflet`.
- **Affected Area:** `package.json`, `node_modules`.
- **Current Behavior:** The application currently renders state and category exploration through high-performance responsive CSS/SVG grids and bespoke cards rather than a Leaflet canvas map.
- **Expected Behavior:** Either implement the interactive Leaflet map view using the installed library or prune unused dependencies to reduce install footprint.
- **Possible Impact:** Slightly larger `node_modules` directory (~3MB).
- **Status:** Unused dependency.
- **Recommended Next Investigation / Fix:** Either connect Leaflet map pins for geographical coordinates or uninstall `leaflet` and `@types/leaflet`.

---

### Issue 7: Browser Web Speech API Accent & Availability Variance
- **Severity:** Low
- **Evidence:** `src/components/StateCategoryExplorer.tsx` lines 212–225 invokes `window.speechSynthesis`.
- **Affected Area:** Classical language pronunciation greetings.
- **Current Behavior:** Pronunciation relies on the client's device having a speech synthesizer supporting `hi-IN`. If not installed, it falls back to default system voice or silent failure.
- **Expected Behavior:** Visual indication when speech synthesis is unsupported on the client's browser.
- **Possible Impact:** Speech audio may sound unnatural or not play on certain locked-down mobile browsers (e.g. older Android WebViews).
- **Status:** Non-blocking enhancement.
- **Recommended Next Investigation / Fix:** Add capability check `if (!('speechSynthesis' in window))` to disable or hide the audio button when unsupported.
