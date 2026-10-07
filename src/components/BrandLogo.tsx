import React from 'react';
import { LanguageKey } from '../i18n.ts';

interface BrandLogoProps {
  lang?: LanguageKey;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  lang = 'en',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
  }[size];

  const titleSizeClasses = {
    sm: 'text-xs sm:text-base',
    md: 'text-sm sm:text-lg lg:text-xl',
    lg: 'text-lg sm:text-2xl',
  }[size];

  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none group cursor-pointer shrink-0">
      {/* Bespoke Heritage Medallion SVG */}
      <div
        className={`${iconSizeClasses} shrink-0 relative rounded-full bg-gradient-to-br from-[#731E15] via-[#5C160F] to-[#360B07] p-1 shadow-md flex items-center justify-center ring-1 ring-[#F59E0B]/60 transition-all duration-300 group-hover:scale-105 group-hover:ring-[#F59E0B] group-hover:shadow-[#8B2E24]/30`}
      >
        <svg
          viewBox="-8 -8 136 136"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich Imperial Gold Gradients */}
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

          {/* Central Sacred Aura Glow */}
          <circle cx="60" cy="60" r="52" fill="url(#sacredAura)" />

          {/* 1. Outer Mani-Mala Ring (32 Micro Jewels = Unity of States & UTs) */}
          <circle
            cx="60"
            cy="60"
            r="55"
            stroke="url(#emblemGold)"
            strokeWidth="0.8"
            strokeDasharray="2 3.4"
            opacity="0.85"
          />

          {/* 2. Concentric Golden Border Ring */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="url(#emblemGold)"
            strokeWidth="1.6"
            strokeOpacity="0.95"
          />

          {/* 3. 24 Solar Rays (Dharma Chakra & 24 Virtues of Civilization) */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 60 + 44 * Math.cos(angle);
            const y1 = 60 + 44 * Math.sin(angle);
            const x2 = 60 + 49 * Math.cos(angle);
            const y2 = 60 + 49 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#emblemGold)"
                strokeWidth={i % 2 === 0 ? "1.4" : "0.8"}
                strokeLinecap="round"
                opacity={i % 2 === 0 ? "0.9" : "0.6"}
              />
            );
          })}

          {/* Inner Astral Guiding Ring */}
          <circle
            cx="60"
            cy="60"
            r="44"
            stroke="#FDE68A"
            strokeWidth="0.6"
            strokeOpacity="0.5"
          />

          {/* 4. Architectural Monument Vimana (North-South Heritage Confluence) */}
          {/* Base Stone Plinth (Jagati Platform) */}
          <path
            d="M26 84 L94 84 L90 89 L30 89 Z"
            fill="url(#emblemGold)"
            opacity="0.9"
          />

          {/* Grand Classical Heritage Arch (Torana & Temple Vimana) */}
          <path
            d="M60 18 
               C52 28, 38 36, 38 56 
               L38 84 
               L82 84 
               L82 56 
               C82 36, 68 28, 60 18 Z"
            fill="url(#archFill)"
            stroke="url(#emblemGold)"
            strokeWidth="1.8"
          />

          {/* Inner Sacred Sanctum Trefoil Arch (Garbhagriha Portal) */}
          <path
            d="M60 32
               C54 40, 46 45, 46 60
               L46 84
               L74 84
               L74 60
               C74 45, 66 40, 60 32 Z"
            fill="#5C160F"
            stroke="#FBBF24"
            strokeWidth="1"
          />

          {/* 5. Poornakalasha Finial (Amrita Vessel Pinnacle of Wisdom) */}
          {/* Pinnacle Spire & Kalasha Kumbha */}
          <path
            d="M60 11 L63 18 L57 18 Z"
            fill="url(#emblemGold)"
          />
          <circle cx="60" cy="10" r="2.2" fill="#FEF08A" />
          <path
            d="M56 18 C56 22, 64 22, 64 18 Z"
            fill="#FBBF24"
          />

          {/* 6. Ashtadal Padma Foundation (8-Petaled Sacred Lotus at Base) */}
          <g transform="translate(0, 2)">
            {/* Center Petal */}
            <path
              d="M60 76 C55 83, 56 90, 60 92 C64 90, 65 83, 60 76 Z"
              fill="url(#emblemGold)"
            />
            {/* Left Inner Petal */}
            <path
              d="M52 79 C46 85, 48 91, 53 92 C56 90, 56 84, 52 79 Z"
              fill="#FBBF24"
              opacity="0.95"
            />
            {/* Right Inner Petal */}
            <path
              d="M68 79 C74 85, 72 91, 67 92 C64 90, 64 84, 68 79 Z"
              fill="#FBBF24"
              opacity="0.95"
            />
            {/* Left Outer Wing Petal */}
            <path
              d="M44 82 C38 87, 41 93, 47 93 C50 91, 49 86, 44 82 Z"
              fill="#D97706"
            />
            {/* Right Outer Wing Petal */}
            <path
              d="M76 82 C82 87, 79 93, 73 93 C70 91, 71 86, 76 82 Z"
              fill="#D97706"
            />
          </g>

          {/* 7. Akhand Gyan Jyoti (Eternal Flame of Living Culture & Folklore) */}
          {/* Flame Core */}
          <path
            d="M60 44
               C56 52, 53 58, 53 66
               C53 72, 56 75, 60 75
               C64 75, 67 72, 67 66
               C67 58, 64 52, 60 44 Z"
            fill="url(#flameGrad)"
          />
          {/* Inner Divine Spark (Bindu) */}
          <path
            d="M60 52
               C58 57, 57 61, 57 66
               C57 69, 58 71, 60 71
               C62 71, 63 69, 63 66
               C63 61, 62 57, 60 52 Z"
            fill="#FFFBEB"
          />

          {/* Sacred Diya Vessel */}
          <path
            d="M50 73 C50 78, 70 78, 70 73 Z"
            fill="url(#emblemGold)"
          />
        </svg>

        {/* Ambient Glass Highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />
      </div>

      {/* Typography Brand Lockup */}
      <div className="flex flex-col text-left min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`font-serif font-extrabold tracking-tight text-stone-900 dark:text-white text-xs sm:text-base lg:text-lg leading-none group-hover:text-[#e0231c] dark:group-hover:text-[#ff5a3c] transition-colors whitespace-nowrap`}
          >
            {lang === 'hi' ? 'भारत दर्शन' : 'BHARAT DARSHAN'}
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e0231c] shrink-0" />
        </div>

        {showSubtitle && (
          <span className="text-[7.5px] xs:text-[8px] sm:text-[9.5px] tracking-tight sm:tracking-widest font-semibold uppercase text-stone-600 dark:text-zinc-400 mt-0.5 leading-tight whitespace-nowrap">
            {lang === 'hi' ? 'राष्ट्रीय सांस्कृतिक अभिलेखागार' : 'National Heritage Archive'}
          </span>
        )}
      </div>
    </div>
  );
};
