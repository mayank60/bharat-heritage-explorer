# 🏛️ BHARAT HERITAGE EXPLORER — SYSTEM ARCHITECTURE & TECHNICAL DEFENSE (VIVA GUIDE)

> **Document Type:** Comprehensive System Architecture, Data Engineering & Viva Voce Defense Guide  
> **Project:** Bharat Heritage Explorer (National Living Cultural Repository)  
> **Architecture Paradigm:** Hybrid Full-Stack (Vite/React 19 SPA + Express Micro-Engine + SQLite3 WAL + Local Client Sanctuary)  
> **Version:** 2.6.0-Production (All 36 States & UTs, 130 Verified National Monuments, Unified 3-Lines Header, Intersection Lazy Loading)  
> **Release Date:** October 2026  

---

## 📑 TABLE OF CONTENTS
1. [Executive Architectural Overview](#1-executive-architectural-overview)
2. [End-to-End System Architecture Diagram](#2-end-to-end-system-architecture-diagram)
3. [Component Hierarchy & State Pipeline](#3-component-hierarchy--state-pipeline)
4. [Data Layer & ASI Gazette Normalization](#4-data-layer--asi-gazette-normalization)
5. [Skeleton Shimmer Loading Architecture](#5-skeleton-shimmer-loading-architecture)
6. [Interactive Subsystems](#6-interactive-subsystems)
   - 6.1 [KaalDrishti 3D Time-Travel Engine](#61-kaaldrishti-3d-time-travel-engine)
   - 6.2 [Monument Popularity Ranking & Instant Discovery Subsystem](#62-monument-popularity-ranking--instant-discovery-subsystem)
   - 6.3 [Heritage Dossier & AMASR Statutory Compliance](#63-heritage-dossier--amasr-statutory-compliance)
   - 6.4 [Browser-Native Multilingual Audio Guide](#64-browser-native-multilingual-audio-guide)
7. [Offline-First Sanctuary & Optimistic Synchronization](#7-offline-first-sanctuary--optimistic-synchronization)
8. [Hardware-Accelerated Glass + Claymorphism Design System](#8-hardware-accelerated-glass--claymorphism-design-system)
9. [Technology Stack & Architectural Justifications](#9-technology-stack--architectural-justifications)
10. [Key Engineering Challenges & Viva Talking Points](#10-key-engineering-challenges--viva-talking-points)

---

## 1. EXECUTIVE ARCHITECTURAL OVERVIEW

The **Bharat Heritage Explorer** is an institutional-grade, interactive digital repository for India's tangible and intangible cultural heritage across all **28 States and 8 Union Territories**.

### Core Tenets:
1. **Zero-Latency State-Wise Navigation:** Instant switching across 36 geographic territories and 6 cultural dimensions without server roundtrips.
2. **Authentic Multimedia Curation:** 130 centrally protected national monuments, each verified with official educational documentary streams (Doordarshan National, Sansad TV, Films Division, Incredible India, National Geographic).
3. **Offline Sanctuary Architecture:** Full graceful degradation when visiting remote archaeological sites with zero network coverage.
4. **Institutional Rigor:** Standardized data schema complying with the **Ancient Monuments and Archaeological Sites and Remains Act (AMASR 1958)**.
5. **Octa-Lingual Localization:** Full linguistic accessibility across 8 regional Indic languages (Hindi, English, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada).

---

## 2. END-TO-END SYSTEM ARCHITECTURE DIAGRAM

```
+----------------------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER / PWA RUNTIME                                    |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  |                                  PRESENTATION & INTERACTION LAYER                            |  |
|  |                                                                                              |  |
|  |  +----------------------+  +---------------------+  +---------------------+                  |  |
|  |  | Navbar (Theme + ☰)   |  | StateCategoryExpl.  |  | KaalDrishti 3D View |                  |  |
|  |  | - BrandLogo + Dot    |  | - 6 Cultural Dims   |  | - Panoramic Scrub   |                  |  |
|  |  | - 3-Lines Drawer     |  | - Popularity-Ranked |  | - Era Reconstruct.  |                  |  |
|  |  | - 8 Indic Languages  |  | - Lazy Image Loader |  |                     |                  |  |
|  |  +-----------+----------+  +----------+----------+  +----------+----------+                  |  |
|  |              |                        |                        |                             |  |
|  |              +------------------------+------------------------+                             |  |
|  |                                           |                                                  |  |
|  |  +----------------------------------------v-----------------------------------------------+  |  |
|  |  |                          HERITAGE DETAIL MODAL & DOSSIER                               |  |  |
|  |  |  • ModalHeroBannerSkeleton       • Verified Documentary Stream Iframe (oEmbed Valid)   |  |  |
|  |  |  • Web Speech Audio Synthesis   • ASI Legal Compliance Gazette & Printable Dossier    |  |  |
|  |  +----------------------------------------+-----------------------------------------------+  |  |
|  +-------------------------------------------|--------------------------------------------------+  |
|                                              |                                                     |
|  +-------------------------------------------v--------------------------------------------------+  |
|  |                                   STATE & LOGIC CONTROLLER                                   |  |
|  |  • Popularity Engine (`monumentPopularity.ts` - High-to-Low Popularity Descending Order)      |  |
|  |  • Master Repository (129+ Verified Monuments across all 36 States & UTs)                    |  |
|  |  • Hoisted O(1) Precomputed State Counts Map (Zero-leakage invariant filtering)              |  |
|  |  • Debounced Query Execution (180ms) & React.memo Card Virtualization                        |  |
|  |  • User Session Passport (Bookmarks, Visited Heritage Log, Community Submissions)           |  |
|  +-------------------------+------------------------------------+-------------------------------+  |
|                            |                                    |                                  |
|                            v (Online Requests)                  v (Offline Fallback)               |
|                 +--------------------+                +--------------------+                       |
|                 | REST API Client    |                | Local IndexedDB /  |                       |
|                 | Axios / Fetch      |                | Standalone HTML    |                       |
|                 +---------+----------+                +--------------------+                       |
+---------------------------|------------------------------------------------------------------------+
                            | HTTP / JSON
                            v
+----------------------------------------------------------------------------------------------------+
|                                    MULTI-ENGINE BACKEND RUNTIMES                                   |
|                                                                                                    |
|  +----------------------------------------------------+  +--------------------------------------+  |
|  |     EXPRESS FULL-STACK SERVER (Node.js/TypeScript) |  |   PYTHON 3 REST API BACKEND (Flask)  |  |
|  |  • Port 3000 Primary Production / Dev Gateway      |  |  • Dual-Engine: Flask OR Built-in    |  |
|  |  • Native `node:sqlite` DatabaseSync Integration   |  |    Zero-Dependency HTTP Server       |  |
|  |  • Static Asset & Dist Serving                    |  |  • Port 5000 / SIH Compliant API     |  |
|  +-------------------------+--------------------------+  +-------------------+------------------+  |
|                            |                                                 |                     |
|                            +------------------------+------------------------+                     |
|                                                     |                                              |
|                                                     v                                              |
|  +----------------------------------------------------------------------------------------------+  |
|  |                                    SQLITE3 DATABASE ENGINE                                   |  |
|  |  • Backed by `backend/bharat_darshan.db` with WAL Journaling Mode                             |  |
|  |  • Unified Relational Tables: `users`, `active_visitors`, `saved_items`, `community_heritage`|  |
|  |  • Instant Microsecond Read Latency & Zero Cloud Billing Footprint                            |  |
|  +----------------------------------------------------------------------------------------------+  |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. COMPONENT HIERARCHY & STATE PIPELINE

### Visual Hierarchy Tree:
```
App.tsx (Root Context, Theme Provider, Sanctuary Banner, Toast Notifier)
 ├── Navbar (BrandLogo with Red Dot, Theme Toggle Sun/Moon, 3-Lines Menu Drawer)
 │    └── Slide-Out Menu Drawer (Visitor Pass, Saved Items, 8 Languages, 36 States, Offline, Add, Admin)
 ├── OfflineSanctuaryBanner (Network listener, Offline cache notifier)
 ├── KageLandingPage (Hero Showcase, Real-time Debounced Search, Zonal Strip, Stat Counters)
 ├── StateCategoryExplorer (Active State Cultural Showcase with Intersection Lazy Loading)
 │    ├── StateCarouselStrip (36 States horizontal selector)
 │    ├── CategoryTabs (Monuments | Festivals | Traditions | Arts | Languages | Food)
 │    ├── MonumentCard (Tactile Claymorphism, Era badge, UNESCO flag, Quick Actions)
 │    └── CulturalCard (Festival lore, Craft origin, Linguistic roots, Culinary heritage)
 ├── StateSidePanel (Deep-dive drawer for State culture, festivals, and food)
 ├── KaalDrishtiViewer (Embedded Modal: 3D Time-Travel Historical Reconstructs)
 ├── HeritageDossierModal (ASI Gazette Print, Statutory Coordinates, Law Compliance)
 ├── HeritageDetailModal (Deep Dive View)
 │    ├── ModalHeroBannerSkeleton & ModalHeroBanner
 │    ├── AudioNarrationBar (Browser-native Web Speech synthesis with Tanpura drone)
 │    ├── TabContent: Overview | Architecture | History & Lore | 360 Gallery | Authentic Stream
 │    └── ModalVideoSkeleton & ModalNarrativeSkeleton
 ├── AddHeritageModal (Crowd-sourced Archaeological Submission Form)
 ├── SavedDrawer (User Visited Diary, Bookmarks & Heritage Collection)
 ├── AdminModal (ASI Curatorial Console with IP-based Rate Limiter)
 ├── UserLoginModal (Visitor Authentication & Pass Issuance)
 ├── LoginGateway (Tactile Gateway Card)
 └── Toast (Ephemeral Floating Alert Notification System)
 ├── UserLoginModal / LoginGateway (Visitor Pass Registration & Session Passport)
 └── Footer (Statutory Notices, ASI AMASR Acknowledgments, Cultural Informatics)
```

---

## 4. DATA LAYER & ASI GAZETTE NORMALIZATION

### Canonical TypeScript Contract (`HeritageItem`):
```typescript
export interface HeritageItem {
  id: string;              // Deterministic slug (e.g., 'tirumala-venkateswara')
  state_id: string;        // Foreign key to state (e.g., 'andhra-pradesh')
  category_id: string;     // 'monuments' | 'festivals' | 'traditions' | 'arts' | 'languages' | 'food'
  title: string;           // Canonical English Title
  hindi_title?: string;    // Authentic Devanagari Script Title
  period: string;          // 'Ancient' | 'Medieval' | 'Mughal' | 'Colonial' | 'Modern'
  location_name: string;   // District & State
  lat: number;             // Precise WGS-84 Latitude
  lng: number;             // Precise WGS-84 Longitude
  summary: string;         // Curatorial introductory summary
  history: string;         // Dynastic & architectural genesis narrative
  culture: string;         // Living socio-religious significance
  image_url: string;       // High-resolution photography asset
  gallery?: string[];      // 360-degree & architectural perspective gallery
  video_url: string;       // Verified public documentary video URL (Validated via oEmbed)
  timings: string;         // Darshan / visiting hours schedule
  best_time: string;       // Optimal climatological season to visit
  unesco_flag: boolean;    // UNESCO World Heritage designation
  is_community?: boolean;  // Crowd-sourced contribution flag
}
```

### Deterministic ASI Identifier Algorithm:
```typescript
export function generateAsiRegistryCode(stateId: string, itemId: string): string {
  const stateCode = stateId.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
  const itemCode = itemId.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
  return `ASI-${stateCode}-${itemCode}`;
}
// Example: 'andhra-pradesh' + 'lepakshi-veerabhadra' -> ASI-AND-LEPA
```

---

## 5. SKELETON SHIMMER LOADING ARCHITECTURE

The application implements a zero-layout-shift Skeleton Loading Suite (`SkeletonLoaders.tsx`) that mirrors the geometric footprint and visual weight of production components:

| Skeleton Component | Targeted View | Emulated Elements | Shimmer Dynamics |
|---|---|---|---|
| **`ShimmerBox`** | Universal Primitive | Base container with royal gold/stone gradient | CSS keyframe `shimmer 2.2s infinite` |
| **`MonumentCardSkeleton`** | Explorer Grid | Image banner (h-48), 2 pill chips, title, 3 summary lines, highlight box, footer | Staggered 60ms delay per card |
| **`CulturalCardSkeleton`** | Explorer Grid | Category badge, title, dual highlight boxes, origin pill | Staggered 60ms delay |
| **`StateCategoryExplorerSkeleton`** | State Switch / Filter | 6-card responsive CSS grid (1 / 2 / 3 columns) | Staggered fade-in |
| **`ModalHeroBannerSkeleton`** | Heritage Modal Top | Full-width 280px hero banner, glowing landmark icon, badge bar | High-contrast dark stone shimmer |
| **`ModalVideoSkeleton`** | Documentary Tab | 16:9 aspect video canvas, central play badge, simulated control bar | Amber-tinted aperture shimmer |
| **`ModalOverviewSkeleton`** | Modal Overview | AMASR statute badge, audio bar, significance box, 3-card coordinate chips | Multi-tier pulsing layout |
| **`ModalGallerySkeleton`** | Modal Gallery Tab | Header action bar, 6-cell square aspect image grid | Aspect-square stone shimmers |
| **`ModalNarrativeSkeleton`** | History & Lore Tab | Dual historical narrative blocks with variable width typography bars | Text line rhythm simulation |

---

## 6. INTERACTIVE SUBSYSTEMS

### 6.1 KaalDrishti 3D Time-Travel Engine
- **Concept:** Reconstructs historical monuments across key dynastic epochs (e.g., Vedic genesis, Classical temple construction, Medieval sultanate era, Colonial preservation, Modern conservation).
- **Architecture:** Scrub-based timeline slider that dynamically alters lighting temperature, architectural rendering overlays, and historical audio ambiances.

### 6.2 Monument Popularity Ranking & Instant Discovery Subsystem
- **Concept:** Enables instant discovery and deep-dive exploration across all national monuments arranged in high-to-low descending popularity order.
- **Implementation:** Precalculated footfall and international prestige weightings (`monumentPopularity.ts`) sort iconic world heritage marvels first, supported by debounced search queries (180ms) and memoized filter lookups with zero network overhead.

### 6.3 Heritage Dossier & AMASR Statutory Compliance
- **Concept:** Generates an official, legal-grade monument dossier complying with the **Ancient Monuments and Archaeological Sites and Remains Act (1958)**.
- **Features:** 
  - Regulated 100m Prohibited Zone and 200m Regulated Zone demarcations.
  - Printable Gazette format with official QR verification codes and coordinates.
  - Statutory preservation guidelines and penalty clauses.

### 6.4 Browser-Native Multilingual Audio Guide
- **Concept:** Provides localized spoken narration without relying on expensive, slow cloud TTS APIs.
- **Implementation:** Wraps the HTML5 `SpeechSynthesis` API with custom language switching (`hi-IN`, `ta-IN`, `te-IN`, `bn-IN`, `en-IN`), filtered native Indian voice selection (`speechSynthesis.getVoices()`), pitch stabilization (1.0), cadence calibration (0.92-0.95), and Web Audio API synthesized tanpura acoustic drone accompaniment.

### 6.5 Crowdsourced Monument Photo Gallery & Live Contribution
- **Concept:** Enables visitors to contribute authentic on-ground photographs to monument detail cards (analogous to Google Maps photo contribution).
- **Architecture:**
  - Client handles both direct image file selection (compressed to web-safe data URI) and direct HTTPS image URL inputs with caption and contributor name.
  - Sanitized through `sanitizeImageUrl` and `sanitizeText`.
  - Dispatched via `addMonumentPhoto()` to Supabase/REST server, broadcasting in real time to all connected clients and updating local state immediately.
  - Fullscreen high-resolution lightbox view with contributor badges and time stamps.

---

## 7. REAL-TIME DATABASE & OFFLINE-FIRST PWA SANCTUARY

```
                                  [ User Mutation ]
                         (Add Heritage / Upload Photo)
                                        │
                                        ▼
                         [ Client-Side Input Sanitizer ]
                             (DOMPurify / Security.ts)
                                        │
                                        ▼
                     [ Multi-Tier Cloud Database Manager ]
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              ▼                         ▼                         ▼
    [ Supabase Client ]        [ Express / Python ]      [ BroadcastChannel ]
  (Direct Cloud WebSocket)      (REST HTTP API)       (Instant Cross-Tab Sync)
              │                         │                         │
              └─────────────────────────┼─────────────────────────┘
                                        │
                                        ▼
                        [ Local IndexedDB / LocalStorage ]
                            (Persistent Offline Cache)
                                        │
                                        ▼
                            [ Service Worker sw.js ]
                     (Cache-First Navigation & Pre-Caching)
```

### Key Architectural Tenets:
1. **Multi-Tier Fault Tolerance:** If Supabase credentials are configured via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, the application connects directly to cloud database channels. In offline or local standalone mode, it gracefully operates via Express backend endpoints and browser `BroadcastChannel` with IndexedDB persistence.
2. **Admin-Shielded Community Governance:** Community additions can be posted by any visitor, but deletion requires authenticated administrative clearance (`DELETE /api/heritage/:id` checks authorization bearer / passcode `asi@bharat`).
3. **PWA Offline Sanctuary:** `public/manifest.json` and `public/sw.js` guarantee the site boots instantly even when opened without an internet connection.

---

## 8. ENTERPRISE-GRADE SECURITY & CRYPTOGRAPHIC PROTECTION

1. **Client-Side Sanitization:** All user inputs (search bars, community forms, photo contributions) are sanitized with DOMPurify to neutralize script injection, HTML attribute breaking, and reflected XSS.
2. **Access Log & PII Masking:** Administrative access records mask visitor IDs and IP addresses (`maskSensitiveId`, `maskIpAddress`), preventing exposure of raw visitor credentials.
3. **Content Security Policy (CSP):** Configured via `<meta http-equiv="Content-Security-Policy">` in `index.html` and HTTP security headers in `vercel.json` (`nosniff`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`).


---

## 8. HARDWARE-ACCELERATED GLASS + CLAYMORPHISM DESIGN SYSTEM

To honor India's architectural majesty without sacrificing 60 FPS mobile performance, we engineered a custom CSS Glass+Claymorphism design system:

```css
/* Tactile Claymorphism Button with Dual Inset Specular Lighting */
.btn-glass-clay {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(180, 83, 9, 0.25));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(245, 158, 11, 0.3);
  box-shadow: 
    inset 1px 1px 2px rgba(255, 255, 255, 0.35),
    inset -1px -1px 2px rgba(0, 0, 0, 0.4),
    0 4px 14px rgba(0, 0, 0, 0.25);
  transform: translateZ(0);
}
```

---

## 9. TECHNOLOGY STACK & ARCHITECTURAL JUSTIFICATIONS

| Layer | Selected Technology | Alternative Rejected | Architectural Justification |
|---|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Vue / Angular | Direct hook composition, concurrent rendering, and strict type safety for heritage datasets. |
| **Bundler & Tooling** | Vite | Webpack | Sub-second cold starts and tree-shaken Rollup builds. |
| **Styling** | Tailwind CSS v4 | CSS Modules / Styled Comp. | Zero runtime style injection, JIT utility compilation, and predictable responsive primitives. |
| **Server Engine** | Express.js + TSX | Nest.js / Fastify | Lightweight, zero-ceremony REST routes with Vite middleware support during development. |
| **Database** | SQLite3 (WAL Mode) | PostgreSQL / MongoDB | Zero-configuration single-file database ideal for immutable national monuments with atomic writes for community submissions. |
| **Video Engine** | YouTube IFrame + oEmbed | Self-hosted MP4 | Zero hosting bandwidth costs, copyright adherence, and access to national archives (Doordarshan/NatGeo). |

---

## 10. KEY ENGINEERING CHALLENGES & VIVA TALKING POINTS

### 🎯 Viva Talking Point 1: Preventing Category Count Collapse ($O(1)$ Invariant Map)
- **Challenge:** Filtering by a single state normally reduces the dataset, which would cause other category tab badges to erroneously drop to "0".
- **Solution:** We decoupled data calculation into two tiers: `useMemo` builds a constant-time precalculated lookup map of all 36 state inventories on mount, while the dynamic category pipeline operates on an isolated slice.

### 🎯 Viva Talking Point 2: 100% Video Authenticity & oEmbed Validation
- **Challenge:** Broken video links and Rickrolls degrade academic and institutional credibility.
- **Solution:** Every single one of the 130 monuments was audited with Python scripts against YouTube's official oEmbed endpoint (`https://www.youtube.com/oembed`), guaranteeing valid, active, non-restricted horizontal documentaries.

### 🎯 Viva Talking Point 3: Zero-Latency Multilingual Narration
- **Challenge:** Cloud text-to-speech services introduce network latency, require API keys, and fail completely when offline.
- **Solution:** Utilized browser-native Web Speech API with automatic voice matching (`hi-IN`, `en-IN`), supplemented with procedural Web Audio tanpura acoustic drones.

---

## 11. PRODUCTION SECURITY & THREAT MITIGATION

| Security Layer | Threat Mitigated | Technical Implementation |
|---|---|---|
| **SQL Injection Guard** | Data Exfiltration / Database Tampering | 100% Parameterized prepared statements (`db.prepare(..., ?)`) using Node's native SQLite engine. |
| **HTTP Security Headers** | MIME-type Sniffing, Clickjacking, XSS | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, `Cross-Origin-Opener-Policy: same-origin`, `Referrer-Policy: strict-origin-when-cross-origin`. Removed server fingerprint `X-Powered-By`. |
| **Two-Tier XSS Neutralizer** | Stored & Reflected Script Injection | Client-side DOMPurify (`security.ts`) + server-side regex tag stripping & strict string length bounding on all POST inputs in `server.ts`. |
| **Timing-Attack Immune Passcode** | Side-Channel Timing Guessing | Constant-time cryptographic comparison via `node:crypto.timingSafeEqual` for administrative actions and deletion gates. |
| **Anti-DDoS API Rate Limiting** | Flooding / Resource Exhaustion | In-memory sliding window bucket limiter capping global traffic to 200 req/min per IP, with automatic memory eviction. |
| **Admin Brute-Force Lockout** | Passcode Guessing Attacks | IP-based sliding window rate limiter on `/api/admin/verify` (max 5 failed attempts $\rightarrow$ automatic 3-minute lockout returning HTTP 429). |
| **Hardened Supabase RLS** | Unauthorized Database Mutation | Column-constrained policies (`id IS NOT NULL`, `length(title) > 0`) targeting `TO anon, authenticated` resolving 100% of Security Advisor warnings. |
| **DoS Payload Limiter** | Memory Exhaustion / Flooding Attacks | Strict `express.json({ limit: '1mb' })` threshold rejecting oversized payloads. |
| **Zero Secret Key Exposure** | Credential Theft & Repository Leaks | `.gitignore` rigorously ignores `.env*`, `backend/*.db`, `*.db-wal`, and `*.db-shm`; client bundle exposes zero private credentials. |

---

## 12. SYSTEM OBSERVABILITY & MONITORING TELEMETRY

| Observability Component | Scope | Metrics / Data Exposed |
|---|---|---|
| **Health Check Endpoint (`GET /api/health`)** | Infrastructure & DB | System status (`healthy`), server uptime in seconds, SQLite connection state, total monuments/states loaded, active visitors, RSS and Heap memory usage in MB. |
| **Performance & Latency Middleware** | Real-Time HTTP Traffic | Automatic console alerting for slow requests (>1000ms) and HTTP 4xx/5xx anomalies with exact execution duration. |
| **Active Multi-Device Registry** | User Sessions | Tracks live visitor sessions, heartbeat pings (`/api/visitors/heartbeat`), and device platform telemetry. |
| **React UI Error Boundary** | Frontend Exception Catching | `ErrorBoundary.tsx` isolates fatal component crashes, prevents full-page blanks, and provides instant "Reload View" recovery. |

---

*Authored for Technical Defense, Code Audits & Viva Voce Evaluations.*  
*National Cultural Informatics Architecture · Republic of India · 2026*
