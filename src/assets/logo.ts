/**
 * Existing Official Bharat Darshan Brand Logo SVG Asset
 */

export const LOGO_SVG_MARKUP = `<svg viewBox="-8 -8 136 136" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="emblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FEF08A" />
      <stop offset="45%" stopColor="#FBBF24" />
      <stop offset="85%" stopColor="#D97706" />
      <stop offset="100%" stopColor="#B45309" />
    </linearGradient>

    <linearGradient id="flameGrad" x1="50%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stopColor="#DC2626" />
      <stop offset="40%" stopColor="#F59E0B" />
      <stop offset="90%" stopColor="#FEF08A" />
      <stop offset="100%" stopColor="#FFFFFF" />
    </linearGradient>

    <radialGradient id="sacredAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.35" />
      <stop offset="60%" stopColor="#B45309" stopOpacity="0.1" />
      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
    </radialGradient>

    <linearGradient id="archFill" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FAF8F5" />
      <stop offset="100%" stopColor="#EFE8DD" />
    </linearGradient>
  </defs>

  <rect x="-8" y="-8" width="136" height="136" rx="68" fill="#5C160F" />
  <circle cx="60" cy="60" r="52" fill="url(#sacredAura)" />
  <circle cx="60" cy="60" r="55" stroke="url(#emblemGold)" strokeWidth="0.8" strokeDasharray="2 3.4" opacity="0.85" />
  <circle cx="60" cy="60" r="50" stroke="url(#emblemGold)" strokeWidth="1.6" strokeOpacity="0.95" />
  <circle cx="60" cy="60" r="44" stroke="#FDE68A" strokeWidth="0.6" strokeOpacity="0.5" />
  <path d="M26 84 L94 84 L90 89 L30 89 Z" fill="url(#emblemGold)" opacity="0.9" />
  <path d="M60 18 C52 28, 38 36, 38 56 L38 84 L82 84 L82 56 C82 36, 68 28, 60 18 Z" fill="url(#archFill)" stroke="url(#emblemGold)" strokeWidth="1.8" />
  <path d="M60 32 C54 40, 46 45, 46 60 L46 84 L74 84 L74 60 C74 45, 66 40, 60 32 Z" fill="#5C160F" stroke="#FBBF24" strokeWidth="1" />
  <path d="M60 11 L63 18 L57 18 Z" fill="url(#emblemGold)" />
  <circle cx="60" cy="10" r="2.2" fill="#FEF08A" />
  <path d="M56 18 C56 22, 64 22, 64 18 Z" fill="#FBBF24" />
  <g transform="translate(0, 2)">
    <path d="M60 76 C55 83, 56 90, 60 92 C64 90, 65 83, 60 76 Z" fill="url(#emblemGold)" />
    <path d="M52 79 C46 85, 48 91, 53 92 C56 90, 56 84, 52 79 Z" fill="#FBBF24" opacity="0.95" />
    <path d="M68 79 C74 85, 72 91, 67 92 C64 90, 64 84, 68 79 Z" fill="#FBBF24" opacity="0.95" />
    <path d="M44 82 C38 87, 41 93, 47 93 C50 91, 49 86, 44 82 Z" fill="#D97706" />
    <path d="M76 82 C82 87, 79 93, 73 93 C70 91, 71 86, 76 82 Z" fill="#D97706" />
  </g>
  <path d="M60 44 C56 52, 53 58, 53 66 C53 72, 56 75, 60 75 C64 75, 67 72, 67 66 C67 58, 64 52, 60 44 Z" fill="url(#flameGrad)" />
  <path d="M60 52 C58 57, 57 61, 57 66 C57 69, 58 71, 60 71 C62 71, 63 69, 63 66 C63 61, 62 57, 60 52 Z" fill="#FFFBEB" />
  <path d="M50 73 C50 78, 70 78, 70 73 Z" fill="url(#emblemGold)" />
</svg>`;

export const LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_SVG_MARKUP)}`;

export default LOGO_DATA_URI;
