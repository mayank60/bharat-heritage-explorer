# 🎨 DESIGN CONSTITUTION & DESIGN SYSTEM
## BHARAT HERITAGE EXPLORER

> **Document Type:** UI/UX Specification, Design System, Spatial Architecture & Tokens  
> **Status:** Production Standard  
> **Design Paradigm:** Tactile Claymorphism + Heritage Glassmorphism + Indic Royal Minimalism  

---

## 1. DESIGN PHILOSOPHY: SACRED ARCHITECTURE MEETS MODERN PRECISION

The design of **Bharat Heritage Explorer** is inspired by the monumental stone temples, royal stepwells, and ancient palace architecture of India. It avoids the sterile, corporate "AI dashboard" look in favor of an aesthetic that feels **tactile, dignified, and carved from ancient sandstone**.

### Core Tenets:
1. **Stone & Terracotta Realism:** Surfaces evoke red sandstone (Agra Fort), golden limestone (Jaisalmer), and weathered basalt (Ajanta & Ellora).
2. **Tactile Depth (Claymorphism):** Elements have dual inner-shadow bevels and diffuse outer drops, making buttons and cards feel like physically touchable clay seals and stone tablets.
3. **Indic Royal Lighting:** Warm amber, temple oil-lamp gold, and sacred saffron highlights contrast against deep temple-basalt dark backgrounds.
4. **Zero-Pill Discipline:** Cards have structured, deliberate corner radii (`rounded-2xl`, `rounded-3xl`) rather than cheap generic pill pills.

---

## 2. COLOR SYSTEM & DESIGN TOKENS

### 2.1 Primary Heritage Palette

| Token Name | Hex Code | HSL / RGB | Semantic Usage |
|---|---|---|---|
| **Terracotta Imperial** | `#5C1D16` | `rgb(92, 29, 22)` | Primary brand headers, royal seal borders, prominent stamps |
| **Crimson Saffron** | `#8B2519` | `rgb(139, 37, 25)` | Active state indicator, secondary royal accents |
| **Temple Amber** | `#D97706` | `rgb(217, 119, 6)` | Highlight glow, era badges, primary interactive buttons |
| **Sacred Gold** | `#EAB308` | `rgb(234, 179, 8)` | UNESCO stars, verified authentic badges, shimmer highlights |
| **Warm Sandstone** | `#FAF8F5` | `rgb(250, 248, 245)` | Light mode parchment background |
| **Carved Limestone** | `#EFE8DD` | `rgb(239, 232, 221)` | Light mode card surfaces, border separators |
| **Temple Basalt Dark** | `#121110` | `rgb(18, 17, 16)` | Dark mode primary obsidian/basalt canvas |
| **Obsidian Shrine** | `#1A1816` | `rgb(26, 24, 22)` | Dark mode elevated card surface |
| **Sanctuary Stone** | `#262320` | `rgb(38, 35, 32)` | Dark mode inset borders and dividers |
| **Verdant Sacred Green** | `#15803D` | `rgb(21, 128, 61)` | Natural heritage badges, ecological sanctuary indicators |

---

## 3. TYPOGRAPHY SYSTEM

The application employs a deliberate dual-typeface pairing engineered for classical grandeur and contemporary legibility:

```
+-------------------------------------------------------------------------------+
| DISPLAY & EPIGRAPHIC HEADINGS: Cinzel (Serif)                                 |
| Modeled after classical Roman & ancient Ashokan epigraphic inscriptions.       |
| Weights: 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)            |
| Letter Spacing: tracking-wide (+0.025em) to tracking-widest (+0.1em)          |
+-------------------------------------------------------------------------------+

+-------------------------------------------------------------------------------+
| BODY, METADATA & UI LABELS: Plus Jakarta Sans (Sans-Serif)                    |
| Engineered for crisp mobile clarity, high optical density, and readability.   |
| Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)              |
+-------------------------------------------------------------------------------+

+-------------------------------------------------------------------------------+
| INDIC SCRIPT FALLBACK: Yatra One / Devanagari Native System                   |
| Used for Devanagari Hindi monument and state naming (e.g., श्री महाकालेश्वर)  |
+-------------------------------------------------------------------------------+
```

### Scale & Hierarchy:
- **Hero Title:** `Cinzel`, 3.5rem (56px) - 4.5rem (72px), Bold, line-height 1.1
- **Section Headers:** `Cinzel`, 1.75rem (28px) - 2.25rem (36px), SemiBold
- **Card Titles:** `Cinzel`, 1.25rem (20px), SemiBold
- **Body Text:** `Plus Jakarta Sans`, 0.9375rem (15px), line-height 1.6
- **Metadata Badges:** `Plus Jakarta Sans`, 0.6875rem (11px) - 0.75rem (12px), SemiBold, Uppercase, tracking-wider

---

## 4. SPATIAL & SURFACE ARCHITECTURE

### 4.1 Tactile Claymorphism Surface Spec
Elements simulate carved terracotta and limestone tiles:
```css
/* Glass-Clay Inset Container */
.surface-clay-stone {
  background: linear-gradient(145deg, rgba(30, 27, 24, 0.95), rgba(18, 17, 16, 0.98));
  border: 1px solid rgba(234, 179, 8, 0.18);
  box-shadow: 
    inset 1px 1px 2px rgba(255, 255, 255, 0.1),
    inset -1px -1px 3px rgba(0, 0, 0, 0.6),
    0 12px 30px -10px rgba(0, 0, 0, 0.5);
  border-radius: 1.25rem; /* 20px */
}
```

### 4.2 Heritage Shimmer Skeleton Spec
During asynchronous content fetching, skeletons shimmer with an authentic warm gold gradient rather than cool blue:
```css
@keyframes heritageShimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-heritage-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(234, 179, 8, 0.08) 50%,
    rgba(255, 255, 255, 0.03) 100%
  );
  background-size: 200% 100%;
  animation: heritageShimmer 2.2s infinite ease-in-out;
}
```

---

## 5. COMPONENT ANATOMY SPECIFICATIONS

### 5.1 Monument Card Anatomy
```
+--------------------------------------------------------------+
| [ Image Container - Aspect 16:10 ]                           |
|  - High-res photo with subtle zoom on hover (scale-105)      |
|  - Top Left: [ UNESCO Heritage Star Badge ]                  |
|  - Top Right: [ Bookmark Star / Visited Check Icon ]         |
|  - Bottom Left Overlay: Era Pill (e.g., 'Ancient • Chola')   |
+--------------------------------------------------------------+
| [ Card Body - Padding 1.25rem ]                              |
|  - Category Pill & Timing Indicator                          |
|  - Canonical English Title (Cinzel Bold)                     |
|  - Devanagari Hindi Title (Devanagari Sub-header)            |
|  - Location (District, State Pin)                            |
|  - 3-Line Curatorial Summary (Truncated with ellipsis)       |
|  - Architectural Highlight Box (Dravidian Gopuram, Carvings) |
+--------------------------------------------------------------+
| [ Card Footer ]                                              |
|  - [ Explore Dossier Button ]  |  [ Audio Guide Play Icon ]  |
+--------------------------------------------------------------+
```

### 5.2 Heritage Detail Modal Anatomy
```
+--------------------------------------------------------------+
| [ Hero Parallax Banner - Height 280px ]                      |
|  - Panoramic photography backdrop                            |
|  - Close Button, Share Dossier Button, Bookmark Toggle       |
|  - AMASR Act Statutory Gazette Code (e.g., ASI-TAM-BRIH)     |
|  - Monument Title & District Subtitle                        |
+--------------------------------------------------------------+
| [ Navigation Tab Bar ]                                       |
|  [ Overview ] [ Architecture ] [ History & Lore ]            |
|  [ 360° Gallery ] [ Documentary Stream ]                     |
+--------------------------------------------------------------+
| [ Active Tab Content Area - Scrollable Container ]           |
|  - Audio Narration Bar with Voice Accent Control             |
|  - Statutory Boundary Zones (100m Prohibited / 200m Buffer)  |
|  - 16:9 Verified Documentary Player with Direct Archive Link |
+--------------------------------------------------------------+
```

### 5.3 Brand Medallion & Unified Header Navigation
```
+----------------------------------------------------------------------------------------------------+
| [ LEFT: Brand Medallion Logo Lockup ]                        [ RIGHT: Minimal Header Controls ]   |
|  - 32 Mani-Mala micro-jewel ring                              - Interactive Spin Theme Toggle      |
|  - 24 Solar Rays (Dharma Chakra)                              - 3-Lines (☰) Slide-Out Drawer       |
|  - Grand Vimana Arch & Akhand Jyoti flame                                                          |
|  - Typography: BHARAT DARSHAN + Glowing Red Dot                                                    |
|  - Subtitle: National Heritage Archive                                                             |
+----------------------------------------------------------------------------------------------------+
```

---

## 6. ACCESSIBILITY & RESPONSIVE BREAKPOINTS

### Breakpoint Discipline:
- **Mobile (`< 640px`):** Single column card layouts, sticky bottom navigation drawer, touch-friendly 44px tap targets.
- **Tablet (`640px - 1024px`):** Two column card grids, simplified state sidebar.
- **Desktop (`> 1024px`):** Three column cards, persistent dual-panel state view, expanded modal dossiers.

### WCAG 2.1 AA Compliance:
- Contrast ratio between text and surface $\ge 4.5:1$ in both light and dark modes.
- Visual focus outlines for all keyboard interactive controls (`focus-visible:ring-2 focus-visible:ring-amber-500`).
- Screen-reader labels (`aria-label`) on all icon-only buttons (search, theme toggle, bookmark, audio play).
