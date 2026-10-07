# Current State Snapshot: Bharat Heritage Explorer (Bharat Darshan)

*Snapshot Date: October 2026*  
*Version: Production Ready / National Cultural Archive*

---

## 1. Project Purpose & Overview
**Bharat Heritage Explorer (Bharat Darshan)** is an interactive, bilingual, national cultural archive and repository dedicated to documenting, exploring, and preserving the living traditions, sacred architecture, UNESCO World Heritage monuments, classical languages, folk arts, and regional cuisines across all **36 States and Union Territories of India**.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19.0.1, TypeScript 5.8 / 7.0.2 |
| **Styling & Design** | Tailwind CSS v4.3.3, Lucide React Icons v0.546.0 |
| **Fonts** | Cinzel (Imperial Serif), Plus Jakarta Sans (Modern UI Sans), Yatra One |
| **Backend & Routing** | Node.js 22, Express 4.21.2, `tsx` TypeScript runtime |
| **Database** | SQLite3 (`backend/bharat_darshan.db`) via Python 3 helper + In-memory persistent stores |
| **Build & Bundling** | Vite 6.1.1, `@tailwindcss/vite`, `vite-plugin-singlefile`, `bundle-standalone.cjs` |
| **Platform Target** | Web SPA, Responsive Mobile (iOS/Android), Offline Single-File HTML distribution |

---

## 3. Directory Structure

```text
/
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── Dockerfile                # Multi-stage production container setup
├── README.md                 # Public project documentation & feature overview
├── VS_CODE_GUIDE.md          # Local developer workstation setup guide
├── backend/
│   ├── README.md             # Python backend documentation
│   ├── app.py                # Standalone Python REST API & HTTP server
│   ├── database.py           # SQLite3 database helper functions
│   └── bharat_darshan.db     # SQLite3 database file
├── index.html                # Web application entry point (HTML5)
├── metadata.json             # AI Studio applet metadata & capabilities
├── netlify.toml              # Netlify static deployment redirect rules
├── package.json              # NPM dependencies & operational scripts
├── scripts/
│   └── bundle-standalone.cjs # Standalone offline single-file HTML bundler
├── server.ts                 # Full-stack Node.js + Express + Vite middleware server
├── src/
│   ├── App.tsx               # Main application container & state orchestrator
│   ├── main.tsx              # React DOM 19 client mount entry point
│   ├── index.css             # Tailwind v4 imports, dark/light theme definitions
│   ├── i18n.ts               # English & Hindi translation dictionaries
│   ├── types.ts              # TypeScript domain interfaces & types
│   ├── assets/               # Curated photography and local imagery
│   ├── components/
│   │   ├── AddHeritageModal.tsx       # User & Admin community contribution form
│   │   ├── AdminModal.tsx             # Protected ASI administrative portal
│   │   ├── BrandLogo.tsx              # Custom SVG medallion & responsive brand lockup
│   │   ├── HeritageDetailModal.tsx    # Comprehensive monument detail & audio modal
│   │   ├── KageLandingPage.tsx        # Hero banner with debounced search & metrics
│   │   ├── LoginGateway.tsx           # Full-screen celestial login screen
│   │   ├── Navbar.tsx                 # Sticky navigation, language & dark/light theme controls
│   │   ├── SavedDrawer.tsx            # Slide-out saved bookmarks management drawer
│   │   ├── StateCategoryExplorer.tsx  # 36 States strip & 6-category discovery grid
│   │   ├── StateSidePanel.tsx         # Slide-out 7-tab state cultural profile
│   │   ├── Toast.tsx                  # Floating notification system
│   │   └── UserLoginModal.tsx         # Visitor pass login & session modal
│   └── data/
│       ├── seedDatabase.ts            # Canonical repository of 36 states, categories, items
│       ├── allStatesData.ts           # State geographical & administrative metrics
│       ├── allStatesHeritage.ts       # Detailed architectural monuments
│       ├── hindiDescriptions.ts       # Curated Hindi historical & cultural descriptions
│       ├── eastNortheastHeritage.ts   # Regional East & Northeast cultural assets
│       ├── extraStateContent.ts       # Supplementary traditions & living lore
│       └── southIslandsHeritage.ts    # South India & Island territories assets
├── standalone.html           # Pre-compiled all-in-one offline distributable artifact
├── tsconfig.json             # TypeScript compiler configuration
├── vercel.json               # Vercel deployment configuration
└── vite.config.ts            # Vite bundler plugins and settings
```

---

## 4. Major Components & Responsibilities

1. **`Navbar` (`src/components/Navbar.tsx`):**
   - Brand logo lockup with responsive size scaling.
   - Quick navigation to 36 States explorer.
   - Bilingual language switch (`हिन्दी / EN`).
   - Theme toggle button (`Sun / Moon`) supporting both Dark Mode (Obsidian) and Light Mode (Ivory).
   - Saved bookmarks badge counter and drawer trigger.
   - Mobile hamburger drawer with full access to all controls.

2. **`KageLandingPage` (`src/components/KageLandingPage.tsx`):**
   - Curatorial header with National Living Cultural Archive badge.
   - Debounced autocomplete search input querying `/api/search-suggest?q=`.
   - Quick category discovery buttons (Monuments, Festivals, Traditions, Arts, Languages, Food).
   - High-trust national metrics cards (36 States, 140+ Monuments, 42 UNESCO sites, 100% ASI data).

3. **`StateCategoryExplorer` (`src/components/StateCategoryExplorer.tsx`):**
   - **Step 1:** 36 States & UTs visual selection strip with region filtering (North, South, West, East, Central, Northeast, Islands) and search filter.
   - **Step 2:** Six dynamic categories ("What do you want to see?"):
     - Historical Monuments & Architecture
     - Festivals & Cultural Fairs
     - Living Traditions & Folk Lore
     - Traditional Arts, Crafts & Handlooms
     - Languages, Ancient Scripts & Greetings (with Web Speech pronunciation)
     - Regional Cuisines & Signature Food
   - **Step 3:** Dynamic result cards rendered in responsive `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` layout.

4. **`HeritageDetailModal` (`src/components/HeritageDetailModal.tsx`):**
   - Multi-tab detailed view (Overview, Architecture, Cultural Lore, Video Tour, Map & Timings, Gallery).
   - Audio narration tour powered by Web Speech API.
   - Local bookmarking and sharing capabilities.

5. **`SavedDrawer` (`src/components/SavedDrawer.tsx`):**
   - Slide-out drawer listing bookmarked monuments, with one-click navigation and batch removal.

6. **`AdminModal` & `AddHeritageModal`:**
   - Administrative portal protected by passcode `asi@bharat`.
   - Form for contributing new monuments, temples, or living cultural traditions to the archive.

---

## 5. API Structure & Backend Routing (`server.ts`)

| HTTP Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check & environment report |
| `GET` | `/api/states` | List all 36 states with item counts and coordinates |
| `GET` | `/api/states/:id` | Detailed state cultural dossier (monuments, food, festivals, languages) |
| `GET` | `/api/categories` | List 6 cultural categories |
| `GET` | `/api/heritage` | Query heritage records with state, category, period, search, and sort filters |
| `GET` | `/api/heritage/:id` | Fetch single heritage item by ID |
| `GET` | `/api/heritage/random` | Retrieve random heritage spotlight item |
| `GET` | `/api/search-suggest` | Debounced autocomplete suggestions for states and monuments |
| `POST` | `/api/login` | Record user login session in memory and SQLite database |
| `GET` | `/api/users` | Retrieve all recorded user sessions from database |
| `POST` | `/api/admin/verify` | Authenticate ASI administrative passcode (`asi@bharat`) |
| `POST` | `/api/heritage` | Admin/User submission of new heritage records |

---

## 6. Current Feature & Verification Status

- **Theme Switching:** Both Dark Mode (`#05070A`) and Light Mode (`#FAF7F2`) are fully verified and operational across all pages, heroes, search dropdowns, cards, drawers, and footers.
- **Mobile Responsiveness:** All grid layouts use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` and adaptive container padding, ensuring full content visibility on smartphones, tablets, and desktops.
- **Localization:** 100% of core views support instant toggle between Hindi and English.
- **Build Status:** Verified through `tsc --noEmit` (0 errors) and `vite build` (succeeded).
