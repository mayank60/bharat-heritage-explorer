# 📜 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## BHARAT HERITAGE EXPLORER (भारत विरासत अन्वेषक)

> **Document Version:** 2.5.0  
> **Status:** Production / Implemented  
> **Product Lead:** Bharat Cultural Informatics Initiative  
> **Target Audience:** Indian Citizens, International Travelers, Students, Historians, Archaeologists, Pilgrims  

---

## 1. PRODUCT VISION & PURPOSE

### 1.1 Executive Vision
**Bharat Heritage Explorer** is a high-performance, web-based digital cultural sanctuary dedicated to preserving, cataloging, and celebrating the tangible and intangible heritage of the **Republic of India** across all **28 States and 8 Union Territories**.

### 1.2 Core Problem Statement
India possesses thousands of years of uninterrupted civilizational history, yet digital cultural tools often suffer from:
- **Fragmentation:** Tangible architectural monuments are severed from intangible cultural contexts (festivals, GI crafts, folklore, culinary traditions).
- **Inauthentic Media:** Widespread presence of dead links, Rickrolls, or misleading clickbait videos in tourist directories.
- **Geographic Bias:** Northeast, Himalayan, and Island territories are often underrepresented or omitted from mainstream tourist portals.
- **Connectivity Vulnerability:** Remote heritage monuments frequently have weak or zero mobile cellular connectivity, rendering online-only apps unusable at the site.

### 1.3 Solution Statement
A unified, resilient, offline-ready cultural repository featuring:
- **36 States & Union Territories Coverage:** 100% geographic completeness.
- **130 Curated National Monuments:** Each equipped with high-definition, verified educational documentary archives (Doordarshan, Sansad TV, Films Division, NatGeo).
- **6-Dimensional Cultural Matrices:** Monuments, Festivals, Living Traditions, GI Arts & Crafts, Classical Languages, and Regional Culinary Heritage.
- **Statutory AMASR Compliance:** Official ASI gazette dossiers with legal buffer zones (100m Prohibited / 200m Regulated).
- **Zero-Latency Offline Sanctuary:** Local caching enabling full operational capability inside stone sanctuaries and remote ruins.

---

## 2. USER PERSONAS

### 2.1 The Heritage Traveler (Aditi, 28)
- **Goal:** Exploring historical sites in person with instant access to authentic architectural history, visiting timings, and entry requirements.
- **Pain Point:** Weak cellular signal inside stone temples; unreliable tourist guides.
- **Feature Needs:** Offline sanctuary mode, browser-native audio guide, visiting hours and best seasons, instant directions and architectural history.

### 2.2 The Student / Civil Services Aspirant (Rohan, 22)
- **Goal:** Preparing for UPSC / State PSC examinations in Indian Art, Architecture & Culture.
- **Pain Point:** Scattered, unverified blogs with factual inaccuracies regarding dynastic timelines.
- **Feature Needs:** Chronological filtering (Ancient, Medieval, Mughal, Colonial, Modern), ASI Gazette Dossiers, UNESCO classification badges, interactive quiz challenge.

### 2.3 The Cultural Historian / Researcher (Dr. K. N. Sharma, 54)
- **Goal:** Cross-referencing regional craft traditions with geographical indications and state folklore.
- **Pain Point:** Lack of multidimensional cultural categorization.
- **Feature Needs:** 6-dimensional category explorer, Devanagari Hindi naming, legislative AMASR boundaries, community submission mechanism.

---

## 3. CORE FUNCTIONAL SPECIFICATIONS

### 3.1 Geographic & Territory Navigation
- **All 36 States & UTs:** Interactive selector categorized by geographic zones (North, South, East, West, Central, Northeast, Islands).
- **Zonal Filtering:** Filter buttons for instant narrowing of states.
- **Stat Counters:** Live count of centrally protected monuments, festivals, crafts, and languages per territory.
- **Global Invariant Counters:** State filtering must never collapse or zero out sibling category count badges.

### 3.2 Six-Dimensional Cultural Explorer
For each selected state, the platform provides 6 distinct dimensions:
1. **Monuments & Archaeological Wonders:** Dynastic architectural marvels, architectural styles (Nagara, Dravida, Vesara, Indo-Saracenic), GPS coordinates, and visiting timings.
2. **Sacred Festivals & Fairs:** Significance, calendar timings, and community rituals.
3. **Living Traditions & Folklore:** Ancient oral lore, philosophical schools, and indigenous customs.
4. **GI Crafts & Master Arts:** Geographical Indication (GI) tagged handlooms, metalworks, woodwork, and painting traditions.
5. **Classical & Regional Languages:** Linguistic families, literary antiquity, and script origins.
6. **Regional Culinary Heritage:** Traditional indigenous preparations, cultural significance, and seasonal preparations.

### 3.3 Curated Video Archive (130 Verified Monuments)
- **Zero Broken Links:** All 130 monuments must feature verified, active horizontal documentary embeds from authoritative channels (Doordarshan, Sansad TV, Films Division, Incredible India, NatGeo).
- **oEmbed Verification:** All URLs must return HTTP 200 on `https://www.youtube.com/oembed`.
- **Zero Shorts / Meme Content:** Standard widescreen video players only.

### 3.4 Skeleton Shimmer Loading Engine
- **Visual Continuity:** Prevent cumulative layout shifts (CLS) during state transitions or modal opening.
- **Tailored Shimmers:** 8 dedicated shimmer components for Monument cards, Cultural cards, Hero banners, Video players, Dossier tabs, and Galleries.

### 3.5 KaalDrishti 3D Time-Travel Engine
- **Historical Reconstruction:** Scrub-based interactive viewer illustrating monuments across multiple eras (e.g., Original Construction, Medieval Expansion, Colonial Era, Modern Conservation).
- **Lighting & Atmospheric Shift:** Color grading and ambient auditory change based on selected era.

### 3.6 Monument Popularity Ranking & Discovery Subsystem
- **High-to-Low Popularity Sorting:** Curated algorithmic ranking index placing India's most visited and world-renowned monuments (Taj Mahal, Qutub Minar, Konark Sun Temple, Hampi, Red Fort, Ajanta Caves, etc.) at the forefront of user discovery.
- **Instant Exploration Discipline:** Streamlined exploration workflow eliminating circular on-screen QR scanning in favor of instant zero-latency browsing and deep curatorial detail cards.

### 3.7 Heritage Dossier & AMASR Statutory Compliance
- **AMASR Act 1958 Alignment:** Demarcation of 100-meter Prohibited Zone and 200-meter Regulated Zone.
- **Official Print Layout:** One-click generation of a print-ready Gazette dossier with official QR verification codes and coordinates.

### 3.8 Multilingual Browser-Native Audio Guide
- **Web Speech API:** In-browser text-to-speech without external cloud latency or subscriptions.
- **Language Switch:** Seamless switching between Hindi (`hi-IN`) and English (`en-IN`).
- **Tanpura Acoustic Drone:** Ambient procedural drone synthesizer for spiritual immersion.

### 3.9 Personal Heritage Passport
- **Visited Heritage Log:** Mark monuments as visited with automatic timestamp and total exploration percentage.
- **Curated Bookmarks:** Save favorites to a dedicated slide-out drawer (`SavedDrawer`).
- **Community Contributions:** Public submission form for proposing newly documented or local heritage sites.

### 3.10 Interactive Heritage Quiz Challenge
- **Knowledge Assessment:** 5-question multi-choice quiz testing knowledge across dynastic architecture, GI crafts, and temple geography.
- **Instant Explanations:** Deep contextual explanations upon answer submission.

### 3.11 Octa-Lingual Indic Localization Matrix
- **8 Constitutional Languages:** Full native UI support for English, Hindi (हिन्दी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी), Gujarati (ગુજરાતી), and Kannada (ಕನ್ನಡ).
- **Zero External Overhead:** Instant zero-network language switching powered by pre-compiled locale dictionaries (`src/i18n.ts`).

### 3.12 Unified Minimalist Navigation & 3-Lines Slide-Out Drawer
- **Clean Header Discipline:** Minimal top bar across desktop and mobile containing the sacred brand medallion logo (with glowing red dot), theme toggle, and 3-lines menu trigger.
### 3.13 Real-Time Multi-Tier Database & Community Submissions
- **Real-Time Global Sync:** Integration with cloud database engine (Supabase Client / REST API fallback / cross-tab `BroadcastChannel`), ensuring community monuments and photo updates propagate instantly across all client sessions without manual refresh.
- **Admin-Gated Deletion:** Community submissions persist permanently in the database; deletion authorization is strictly restricted to authenticated ASI Administrators with the official passkey (`asi@bharat`).
- **Crowdsourced Monument Photo Gallery:** Google Maps-style photo contribution allowing visitors to upload image files or submit high-resolution HTTPS image URLs with author attribution and captions, syncing live to the monument's public photo stream.

### 3.14 Offline-First PWA Sanctuary
- **Instant Offline Boot:** Progressive Web App (`manifest.json` and `sw.js`) precaches core application shells, fonts, and catalog assets, enabling instant load directly from browser cache even when launched with no active internet connection.
- **Graceful Network Degradation:** Transparent fallback with cached data snapshots and offline indicator status toasts during connectivity drops.

### 3.15 Enterprise-Grade Security & Cryptographic Protection
- **Two-Tier Input Sanitization:** Robust DOMPurify sanitization on the client alongside server-side regex tag stripping and strict string bounding across all search queries, community submissions, photo captions, and user forms to neutralize XSS, script injection, and markup tampering.
- **SQL Injection Immunity:** 100% Parameterized prepared statements (`db.prepare(..., ?)`) protecting all local SQLite operations from SQLi attacks.
- **Timing-Attack Immune Passcode:** Constant-time cryptographic comparison via `node:crypto.timingSafeEqual` protecting administrative verification and deletion operations.
- **Anti-DDoS & Brute-Force Rate Limiting:** In-memory sliding window bucket limiter (200 req/min API traffic) with automatic 3-minute IP lockout after 5 consecutive failed administrative verification attempts.
- **Data Protection & PII Masking:** Automatic masking of visitor pass numbers, session tokens, and IP addresses in administrative access audit logs, with authorized decrypt toggle.
- **HTTP Security & Clickjacking Protection:** Strict CSP meta tags, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, `Cross-Origin-Opener-Policy: same-origin`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Hardened Supabase RLS:** Column-validated policies (`id IS NOT NULL`, `length(title) > 0`) targeting `TO anon, authenticated` with 0 warnings in Supabase Security Advisor.

---

## 4. NON-FUNCTIONAL REQUIREMENTS (NFR)

| Metric | Target | Verification Method |
|---|---|---|
| **First Contentful Paint (FCP)** | < 1.2 seconds | Lighthouse Performance Audit |
| **Time to Interactive (TTI)** | < 2.0 seconds | Chrome DevTools Performance Profiler |
| **Cumulative Layout Shift (CLS)** | 0.00 | Skeleton Shimmer Loaders on all async boundaries |
| **Frame Rate** | Sustained 60 FPS | GPU-accelerated CSS transforms and transitions |
| **Offline Availability** | 100% core catalog access | Service Worker (`sw.js`) / CacheStorage precaching |
| **Video Link Validity** | 100% active (0 dead links) | Automated oEmbed API validation script |
| **Input Sanitization** | 100% XSS immune | DOMPurify sanitization on all user input vectors |
| **Real-time Sync Latency** | < 300 ms across clients | Supabase Realtime / BroadcastChannel sync |
| **Accessibility** | WCAG 2.1 Level AA | Semantic HTML, ARIA attributes, contrast ratios > 4.5:1 |
| **Browser Compatibility** | Chrome, Edge, Safari, Firefox | Responsive mobile, tablet, and desktop viewports |

---

## 5. SUCCESS CRITERIA & KPIS

1. **Zero-Defect Multimedia Delivery:** 0% missing or placeholder video URLs across all 130 monument profiles.
2. **100% State/UT Representation:** All 36 constitutional administrative divisions populated with verified cultural data.
3. **Flawless Offline Resilience:** Smooth catalog browsing and bookmarking during simulated `navigator.onLine = false` network blackouts.
4. **Real-Time Community Crowdsourcing:** Live multi-client updates for community monuments and monument photo galleries with zero data loss.
5. **National Deployment Readiness:** Strict CSP, HTTPS asset security, SEO meta optimization, and dual-mode deployment (cloud-ready Vercel + standalone drag-and-drop HTML).

