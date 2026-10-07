# ⚖️ ENGINEERING, DEVELOPMENT & DATA RULES
## BHARAT HERITAGE EXPLORER

> **Document Type:** Core Architectural Principles, Coding Standards & Data Integrity Guidelines  
> **Status:** Active Enforcement  
> **Applies to:** Frontend Components, Backend Express Endpoints, Data Schemas, Build Pipelines  

---

## 1. DATA INTEGRITY & MONUMENT RULES

### 1.1 Zero-Placeholder Video Policy
- **Strict Prohibition:** Under NO circumstances may placeholder video IDs (such as `5a34uA7dIug` or Rickrolls `dQw4w9WgXcQ`) exist in production datasets.
- **Verification Requirement:** Every monument video URL must be validated against `https://www.youtube.com/oembed?url=...&format=json` and confirm HTTP status code `200` before inclusion.
- **Source Authority Priority:**
  1. Doordarshan National / Prasar Bharati Archives
  2. Sansad TV / Rajya Sabha TV Heritage Features
  3. Films Division of India
  4. Ministry of Tourism (Incredible India)
  5. National Geographic / BBC / UNESCO Official Archives
  6. Verified High-Production Cultural Historians (e.g., Siddhartha Joshi, Project Shivoham)
- **Aspect Ratio Rule:** Exclusively horizontal (16:9) documentary videos are permitted. YouTube Shorts (`/shorts/`) are strictly forbidden in monument dossiers.

### 1.2 Deterministic ASI Gazette Identifier Formatting
- Every monument MUST possess an ASI identifier adhering to the standard formula:
  $$\text{ASI-REGISTRY-ID} = \text{"ASI-"} + \text{STATE\_SLUG}[0..2].\text{toUpperCase}() + \text{"-"} + \text{ITEM\_SLUG}[0..3].\text{toUpperCase}()$$
- Examples:
  - `shikharji-parasnath` (Jharkhand) $\rightarrow$ `ASI-JHA-SHIK`
  - `tirumala-venkateswara` (Andhra Pradesh) $\rightarrow$ `ASI-AND-TIRU`
  - `lepakshi-veerabhadra` (Andhra Pradesh) $\rightarrow$ `ASI-AND-LEPA`

### 1.3 Bilingual Titling Requirement
- Every national monument should feature both its canonical English title and an authentic Devanagari Hindi title (`hindi_title`) to ensure constitutional respect and domestic accessibility.

---

## 2. STATE & REACT ARCHITECTURE RULES

### 2.1 Global Count Invariance Rule
- When the user isolates a state (e.g., "Kerala"), the global category counter badges MUST NOT collapse to zero.
- The `stateCountsMap` must always be precalculated via `useMemo` from the master immutable dataset, maintaining $O(1)$ constant-time counts.
- **Never mutate master data arrays directly.** Use immutable filter/map patterns.

### 2.2 Skeleton Shimmer Coverage Rule
- Every asynchronous transition (e.g., changing state, switching categories, opening deep-dive modal, initiating video playback) must render a dedicated skeleton loader component from `SkeletonLoaders.tsx`.
- Skeletons must mirror the geometric aspect ratio and height of the destination component to achieve **0.00 Cumulative Layout Shift (CLS)**.

### 2.3 Single-Source-of-Truth Theme Management
- Theme persistence must execute synchronously in the `<head>` of `index.html` before DOM paint to prevent white flashbangs in dark mode:
  ```javascript
  const savedTheme = localStorage.getItem('bharat_heritage_dark');
  if (savedTheme === 'false') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
  ```

### 2.4 Strict Body Scroll Lock & Overscroll Containment
- Whenever a modal, drawer, or the 3-line hamburger menu is open:
  - Background scrolling must be locked via `useBodyScrollLock` (`document.body.style.overflow = 'hidden'`, `document.documentElement.style.overflow = 'hidden'`, and `body.modal-open`).
  - Scrollable child containers must use `overscroll-contain` (`overscroll-behavior: contain`) to prevent scroll chaining to the underlying webpage.
  - Backdrop overlays must use `touch-none` and prevent touchmove propagation.

---

## 3. UI/UX & STYLING RULES

### 3.1 Zero-Pill & Anti-AI-Slop Constitution
- Avoid generic, low-effort UI tropes:
  - No floating pastel colored pills with generic gradients.
  - No generic AI sparkle buttons with hollow functionality.
  - No unnecessary decorative elements that do not serve cultural or functional value.
- Surfaces must feel tactile, stone-carved, and reminiscent of Indian architectural craftsmanship.

### 3.2 Tailored Typography
- **Headings & Display:** `Cinzel`, serif (royal inscriptions, monument titles, state names).
- **Body & Prose:** `Plus Jakarta Sans`, sans-serif (descriptions, history, logistics).
- **Indic Script:** `Yatra One` / Devanagari system fallback for Hindi text.
- **No inline styles:** Exclusively Tailwind utility classes and hardware-accelerated CSS classes.

### 3.3 Hardware-Accelerated 60 FPS Rule
- All animated elements, hover lifts, and modal transitions must utilize GPU-accelerated CSS properties:
  - `transform: translate3d(0, 0, 0)` or `transform: translateZ(0)`
  - `will-change: transform, opacity`
  - No animating `height`, `width`, `top`, or `margin` directly.

---

## 4. OFFLINE-FIRST & RESILIENCE RULES

### 4.1 Dual-Tier Persistence
- All user modifications (visited logs, bookmarks, custom community submissions) MUST be optimistically applied to React state and persisted to `localStorage` / `IndexedDB` immediately.
- If network connection fails (`navigator.onLine === false`), the app must display the `OfflineSanctuaryBanner` and silently buffer outgoing operations to the sync queue.

### 4.2 Browser-Native Audio Rules
- Audio narration must utilize the browser's built-in `SpeechSynthesis` API.
- Do NOT introduce external cloud text-to-speech APIs that add billing dependencies, API keys, or network latency.
- Voice selection must prioritize `hi-IN` for Hindi titles and `en-IN` for English text.

---

## 5. CODEBASE & DEPLOYMENT RULES

### 5.1 Port & Runtime Discipline
- Development server MUST run on **Port 3000**.
- Express backend routes must use Vite's development middleware (`vite.middlewares`) during development and static build delivery in production.

### 5.2 TypeScript & Linting
- All files must be valid TypeScript with strict type checking enabled.
- `npm run lint` (`tsc --noEmit`) must pass with **0 errors and 0 warnings** prior to deployment.
- Never use `any` when a known interface (`HeritageItem`, `State`, `UserSession`) exists.

### 5.3 Git & Commit Etiquette
- Commit messages must be scannable, descriptive, and atomic.
- Generated build artifacts (`dist/`) and local cache files must remain in `.gitignore`.
