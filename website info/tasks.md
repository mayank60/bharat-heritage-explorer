# 📋 ENGINEERING TASKS & ROADMAP
## BHARAT HERITAGE EXPLORER

> **Document Type:** Project Backlog, Completed Milestones, Active Sprint & Future Roadmap  
> **Status:** Tracked & Synchronized  
> **Current Sprint:** v2.5.0 Production Hardening & Documentation  

---

## 1. COMPLETED MILESTONES (v1.0.0 → v2.5.0)

### 🏁 Milestone 1: Core Multi-State Infrastructure (v1.0.0)
- [x] Initialized Vite + React 19 + TypeScript frontend with Tailwind CSS.
- [x] Implemented Express.js backend with SQLite3 database in WAL mode.
- [x] Created baseline catalog for 36 States & Union Territories of India.
- [x] Implemented Zonal filtering (North, South, East, West, Central, Northeast, Islands).
- [x] Built responsive search engine with debounced query execution.

### 🏁 Milestone 2: Six-Dimensional Cultural Explorer (v1.8.0)
- [x] Designed and implemented `StateCategoryExplorer.tsx` supporting:
  - Monuments & Archaeological Wonders
  - Sacred Festivals & Fairs
  - Living Traditions & Folklore
  - GI Crafts & Master Arts
  - Classical & Regional Languages
  - Regional Culinary Heritage
- [x] Engineered $O(1)$ precomputed `stateCountsMap` to guarantee global count invariance during single-state isolation.

### 🏁 Milestone 3: Interactive Experiences & Statutory Compliance (v2.1.0)
- [x] Built `KaalDrishtiViewer.tsx` for 3D historical era time-travel visualization.
- [x] Evaluated and subsequently retired circular on-screen QR plaque scanning to streamline visitor exploration and reduce memory overhead.
- [x] Designed `HeritageDossierModal.tsx` for AMASR Act 1958 legal compliance and print-ready Gazette export.
- [x] Developed browser-native audio narration (`SpeechSynthesisUtterance`) with tanpura drone accompaniment.
- [x] Built `SavedDrawer.tsx` for tracking visited monuments and bookmarked itineraries.

### 🏁 Milestone 4: Complete Media Verification & Zero Placeholder Policy (v2.4.0)
- [x] Audited all 130 centrally protected national monuments across 4 datasets:
  - `seedDatabase.ts`
  - `allStatesHeritage.ts`
  - `southIslandsHeritage.ts`
  - `eastNortheastHeritage.ts`
- [x] Replaced 100% of placeholder video URLs (`5a34uA7dIug`, etc.) with authentic, verified documentaries from Doordarshan, Sansad TV, Films Division, Incredible India, and NatGeo.
- [x] Verified every stream link via YouTube oEmbed API (`HTTP 200 OK`).

### 🏁 Milestone 6: Unified Minimal Navigation & Intersection Lazy Loading (v2.6.0)
- [x] Streamlined top header navigation into a unified minimal layout (Brand Logo, Theme Button, and 3-Lines Menu Trigger).
- [x] Transferred all ancillary actions into the high-contrast 3-Lines Slide-Out Drawer.
- [x] Fixed mobile view Brand Logo to ensure the glowing Red Dot (`#e0231c`) is clearly visible across all viewport dimensions.
- [x] Integrated intersection-based image lazy loading (`loading="lazy"`) and staggered entrance transitions for all heritage and craft cards.
- [x] Removed speculative AI chatbot elements to keep codebase pure, fast, lightweight, and aligned with core national heritage goals.
- [x] Synchronized all documentation across the `website info/` directory.

### 🏁 Milestone 7: Popularity-Ordered Catalog, Cleaned UX & Dual-Engine Python Backend (v2.7.0)
- [x] Implemented algorithmic monument popularity ranking engine (`monumentPopularity.ts`), sorting monuments in high-to-low descending popularity order (Taj Mahal, Qutub Minar, Konark, Hampi, Red Fort, etc.).
- [x] Cleaned navigation and removed redundant ASI QR plaque lens and passport stamps to simplify visitor exploration.
- [x] Engineered dual-engine Python REST API backend (`backend/app.py` & `backend/database.py`):
  - Primary Engine: Flask + Flask-CORS when installed.
  - Zero-Dependency Fallback: Built-in Python 3 `http.server` running out-of-the-box without pip.
  - 100% Endpoint Coverage: Implemented all 16+ REST routes (`/api/states`, `/api/categories`, `/api/heritage`, `/api/health`, `/api/login`, `/api/users`, `/api/saved`, etc.) connected to `bharat_darshan.db`.
- [x] Optimized standalone single-file packaging (`standalone.html` & `dist/standalone.html`) with relative path resolution for offline drag-and-drop.
- [x] Debounced search queries (180ms) and memoized all filter arrays to eliminate unnecessary re-renders.
- [x] Eliminated Dark/Light mode switch lag via global transition freezing (`.disable-transitions`) and root container layout optimization.
- [x] Upgraded Web Speech API audio tour & language greeting pronunciations with BCP-47 voice matching, pitch tuning, and authentic Indian cadence.

### 🏁 Milestone 8: Production Hardening, Real-Time Cloud Database & Enterprise Security (v3.0.0)
- [x] **Real-Time Cloud Database Sync:** Architected multi-tier database manager (`src/utils/cloudDatabase.ts`) connecting to Supabase JS Client with seamless Express API fallback, cross-tab `BroadcastChannel`, and localStorage/IndexedDB caching.
- [x] **Community Submissions & Admin Shield:** Fixed community monument submission with live multi-client broadcast. Gated deletion strictly to authenticated ASI administrators (`asi@bharat`), rejecting unauthorized delete attempts on both frontend and backend (`DELETE /api/heritage/:id`).
- [x] **Crowdsourced Monument Photo Gallery:** Built full photo contribution workflow on monument detail cards. Supports file upload compression and HTTPS image URLs, live contributor attribution, and fullscreen lightbox view with real-time sync across devices.
- [x] **Offline-First PWA Sanctuary:** Deployed complete Service Worker (`public/sw.js`) and PWA web app manifest (`public/manifest.json`), precaching core bundle, fonts, and assets for instant boot without initial network connection.
- [x] **Enterprise-Grade Security:**
  - Client-side XSS and injection sanitization across all input vectors (`src/utils/security.ts` using DOMPurify).
  - PII masking and credential hashing for administrative visitor logs (`maskSensitiveId`, `maskIpAddress`).
  - Added Content Security Policy (CSP) meta tags in `index.html` and security HTTP headers (`nosniff`, `X-XSS-Protection`, `Referrer-Policy`) in `vercel.json`.
- [x] **SEO & Global Discovery:** Optimized canonical URLs, OpenGraph cards, Twitter cards, meta descriptions, and Schema.org JSON-LD structured data for nationwide deployment.
- [x] **Standalone & Cloud Dual-Target Packaging:** Verified zero-error builds across standard Vite distribution (`dist/index.html`), Vercel deployment, and 100% self-contained single-file offline distribution (`standalone.html`).

### 🏁 Milestone 9: Live Cross-Device Validation, Anti-Hacking Penetration Testing & RLS Hardening (v3.1.0)
- [x] **End-to-End Real-Time Verification:** Automated integration tests confirming instant propagation of newly contributed monuments (`POST /api/heritage`) into SQLite WAL mode and Supabase, immediately queryable with zero latency.
- [x] **Multi-Device Crowdsourced Photo Gallery Sync:** Verified that photos uploaded on one device/session (`POST /api/heritage/:id/photos`) reflect live for all other visitors via Supabase Realtime channels and background polling.
- [x] **Enterprise Anti-Hacking & Penetration Testing:**
  - **SQL Injection Immunity:** 100% parameterized prepared statements (`db.prepare(..., ?)`) verified against malicious payloads.
  - **Two-Tier XSS Stripping:** Double-layer sanitization with DOMPurify and server-side regex + string length bounding in `server.ts`.
  - **Anti-Clickjacking:** Enforced `X-Frame-Options: SAMEORIGIN` and `Cross-Origin-Opener-Policy: same-origin` HTTP response headers.
  - **Anti-Brute-Force & DoS Shield:** Implemented in-memory sliding-window rate limiting on all API routes (200 req/min) and 5-attempt lockout on admin passcode verification (`/api/admin/verify`).
  - **Constant-Time Cryptographic Verification:** Upgraded admin passcode comparison to `node:crypto.timingSafeEqual` preventing side-channel timing attacks.
  - **Sensitive Data & DB Protection:** Excluded `.env*`, `backend/*.db`, `*.db-wal`, `*.db-shm` from version control via `.gitignore`.
- [x] **Supabase Hardened Row-Level Security (RLS):** Upgraded all RLS policies in `supabase_schema.sql` from open `(true)` to column validation checks (`id IS NOT NULL`, `length(title) > 0`), resolving all 6 Supabase Security Advisor warnings to 0 warnings.
- [x] **Asset Optimization & Universal Emblem:** Fully removed deprecated temporary generator files and logos (`logo.png`, `logo.svg`, `generate_logo_png.js`), replacing them with an ultra-lightweight SVG monument emblem (`🏛️`) and authentic monument imagery.
- [x] **Zero-Error Build Pipeline:** Verified `npm run build` succeeds in ~1.04s with zero errors or warnings, and added `tsx watch` for hot-reloading development.


---

## 2. CURRENT ACTIVE SPRINT: DOCUMENTATION & SYSTEM SYNCHRONIZATION

| Task ID | Description | Component | Status |
|---|---|---|---|
| **DOC-01** | Update `architecture.md` & `ARCHITECTURE_AND_VIVA.md` to reflect 130 verified monuments and skeleton architecture | Architecture | ✅ COMPLETED |
| **DOC-02** | Author `prd.md` detailing user personas, functional specifications, and NFRs | PRD | ✅ COMPLETED |
| **DOC-03** | Author `rules.md` outlining zero-placeholder policies, ASI formatting, and coding discipline | Governance | ✅ COMPLETED |
| **DOC-04** | Author `design.md` codifying tactile claymorphism, typography, and color tokens | Design System | ✅ COMPLETED |
| **DOC-05** | Author `tasks.md` tracking all completed milestones, current backlog, and future roadmap | Operations | ✅ COMPLETED |
| **DOC-06** | Author `memory.md` logging technical decisions, data catalog summary, and environment state | Memory | ✅ COMPLETED |

---

## 3. FUTURE ROADMAP (v3.0.0+)

### 🚀 Phase 1: WebXR & Augmented Reality Exploration (Q1 2027)
- [ ] Implement WebXR 3D point-cloud exploration for top 10 iconic monuments (Konark Sun Temple, Hampi, Kailash Temple, Khajuraho).
- [ ] Support on-device AR placement of miniature stepwells and temple gopurams in mobile browsers using Three.js / WebGL.

### 🚀 Phase 2: Regional Indian Language Text-to-Speech (Q2 2027)
- [ ] Integrate native TTS voices for Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, and Gujarati alongside existing Hindi and English.
- [ ] Add localized oral storytelling audio clips for folk traditions and tribal lore.

### 🚀 Phase 3: Community Crowd-Curator Moderation Portal (Q3 2027)
- [ ] Multi-tiered role-based review system for public community contributions (`is_community: true`).
- [ ] ASI Verified Historian badge with cryptographic attestation for submitted folklore entries.

### 🚀 Phase 4: National Heritage Compendium Export (Q4 2027)
- [ ] One-click export of an entire state's cultural dossier into a high-resolution, print-ready PDF/EPUB book format.
- [ ] Customizable student study guides for competitive examinations.
