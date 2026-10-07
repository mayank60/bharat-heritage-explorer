import React, { useState } from 'react';
import { Bookmark, Moon, Sun, Globe, Menu, X, PlusCircle, Compass, User, Wifi, WifiOff } from 'lucide-react';
import { LanguageKey, TRANSLATIONS, AVAILABLE_LANGUAGES } from '../i18n.ts';
import { BrandLogo } from './BrandLogo.tsx';
import { UserSession } from '../types.ts';
import { useBodyScrollLock } from '../utils/useBodyScrollLock.ts';

interface NavbarProps {
  lang: LanguageKey;
  onToggleLang: () => void;
  onSelectLang?: (lang: LanguageKey) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenAdmin: () => void;
  onOpenContribute?: () => void;
  onNavigateSection: (sectionId: string) => void;
  currentUser?: UserSession | null;
  onOpenLogin?: () => void;
  totalVisitorsCount?: number;
  isOfflineMode?: boolean;
  onToggleOfflineMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  onSelectLang,
  darkMode,
  onToggleDarkMode,
  savedCount,
  onOpenSaved,
  onOpenAdmin,
  onOpenContribute,
  onNavigateSection,
  currentUser,
  onOpenLogin,
  isOfflineMode,
  onToggleOfflineMode,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock background scroll when 3-lines menu drawer is open
  useBodyScrollLock(isMobileMenuOpen);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleLanguageSelect = (newLang: LanguageKey) => {
    if (onSelectLang) {
      onSelectLang(newLang);
    } else {
      if (newLang !== lang) onToggleLang();
    }
  };

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 1. TOP NAVBAR CONTAINER: Dynamic background adapts cleanly to Dark & Light themes */}
      <header className={`w-full backdrop-blur-md border-b sticky top-0 z-50 px-3 sm:px-6 py-2.5 flex items-center justify-between transition-colors duration-200 ${
        darkMode
          ? 'bg-[#05070a]/95 border-white/[0.08] text-[#dfe7e0]'
          : 'bg-[#fcfaf7]/95 border-stone-200 text-stone-900 shadow-xs'
      }`}>
        {/* 2. LEFT SECTION (BRAND & LOGO): Protected with shrink-0 so it never overlaps or gets squished */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('hero')}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e0231c] rounded-lg shrink-0 text-left cursor-pointer"
            aria-label="Bharat Heritage Home"
          >
            <BrandLogo lang={lang} size="sm" showSubtitle={true} />
          </button>
        </div>

        {/* 3. RIGHT SECTION: Clean & Focused Header Controls (Theme Button + 3-Lines Menu Trigger) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Button (Sun/Moon icon button) with Animated Spin Effect */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="btn-glass-clay btn-glass-clay-secondary h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center cursor-pointer rounded-xl shrink-0 group transition-all duration-300 hover:scale-105 active:scale-95"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-500 group-hover:rotate-90" />
            ) : (
              <Moon className="w-4 h-4 text-stone-800 dark:text-stone-200 transition-transform duration-500 group-hover:-rotate-45" />
            )}
          </button>

          {/* 3-Lines / Hamburger Menu Button (☰) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn-glass-clay btn-glass-clay-icon h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-xl cursor-pointer shrink-0 text-stone-800 dark:text-stone-200"
            aria-label="Toggle navigation menu"
            title="Menu & Services"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-stone-800 dark:text-stone-200" />
            ) : (
              <Menu className="w-4 h-4 text-stone-800 dark:text-stone-200" />
            )}
          </button>
        </div>
      </header>

      {/* 5. SLIDE-OUT DRAWER / MENU (Responsive & High Contrast in Dark & Light Modes) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity touch-none"
            onClick={() => setIsMobileMenuOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <div className={`relative w-[320px] sm:w-[380px] max-w-[85vw] h-full border-l p-5 z-50 flex flex-col justify-between shadow-2xl overflow-y-auto overscroll-contain animate-in slide-in-from-right duration-200 ${
            darkMode
              ? 'bg-[#0a0e12] border-white/10 text-white'
              : 'bg-[#fcfaf7] border-stone-200 text-stone-900'
          }`}>
            {/* Top section: Drawer Header with Close Button (✕) */}
            <div className="space-y-5">
              <div className={`flex items-center justify-between pb-3.5 border-b ${
                darkMode ? 'border-white/10' : 'border-stone-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-amber-600 dark:text-amber-300 text-sm tracking-wide">
                    {lang === 'hi' ? 'नेविगेशन एवं सेवाएं' : 'MENU & SERVICES'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-glass-clay btn-glass-clay-icon h-8 w-8 flex items-center justify-center rounded-lg text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* [• MANISH RAJ] Profile Pill */}
              {currentUser ? (
                <div className="btn-glass-clay btn-glass-clay-emerald w-full p-3 rounded-xl flex items-center justify-between gap-3 text-stone-900 dark:text-white">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block text-left truncate">
                      {lang === 'hi' ? 'सक्रिय दर्शनार्थी पास' : 'Active Visitor Pass'}
                    </span>
                    <span className="font-bold text-sm text-emerald-950 dark:text-emerald-200 block text-left truncate">
                      {currentUser.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLogin?.();
                    }}
                    className="btn-glass-clay btn-glass-clay-secondary px-3 py-1 text-xs font-semibold cursor-pointer rounded-lg shrink-0"
                  >
                    {lang === 'hi' ? 'पास विवरण' : 'Pass'}
                  </button>
                </div>
              ) : (
                onOpenLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="btn-glass-clay btn-glass-clay-secondary w-full p-2.5 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-300 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-500" />
                      <span>{lang === 'hi' ? 'दर्शनार्थी पास बनाएं' : 'Get Visitor Pass'}</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono bg-amber-500/20 px-2 py-0.5 rounded font-bold">
                      Free
                    </span>
                  </button>
                )
              )}

              {/* [Saved] Pill Button (warm orange pill style with bookmark icon & count) */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSaved();
                }}
                className="btn-glass-clay btn-glass-clay-primary w-full py-2.5 px-3.5 text-sm font-semibold flex items-center justify-between gap-4 cursor-pointer text-white"
              >
                <span className="flex items-center gap-2 min-w-0 flex-1 text-left truncate">
                  <Bookmark className="w-4 h-4 shrink-0" />
                  <span>{t.nav_saved || 'Saved Items'}</span>
                </span>
                <span className="font-mono text-xs bg-black/35 text-amber-100 border border-white/20 px-2 py-0.5 rounded font-bold shrink-0">
                  {savedCount}
                </span>
              </button>

              {/* 8 Regional Languages Mobile Picker Grid */}
              <div className={`p-3 rounded-2xl border ${
                darkMode
                  ? 'bg-stone-900/90 border-stone-800'
                  : 'bg-stone-100/90 border-stone-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.select_lang_title || 'Select Language (भाषा):'}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-400">
                    8 Languages
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {AVAILABLE_LANGUAGES.map((langOption) => (
                    <button
                      key={langOption.code}
                      type="button"
                      onClick={() => {
                        handleLanguageSelect(langOption.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                        lang === langOption.code
                          ? 'btn-glass-clay btn-glass-clay-primary text-white border-amber-400 shadow-xs'
                          : 'border-transparent bg-stone-200/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{langOption.nativeLabel}</div>
                      <div className="text-[9px] opacity-75 truncate">{langOption.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary quick links */}
              <div className={`space-y-2 pt-2 border-t ${darkMode ? 'border-white/10' : 'border-stone-200'}`}>
                {/* 36 States Button */}
                <button
                  type="button"
                  onClick={() => handleNavClick('state-explorer')}
                  className="btn-glass-clay btn-glass-clay-secondary w-full py-2.5 px-3.5 text-sm font-semibold flex items-center justify-between gap-4 cursor-pointer text-stone-800 dark:text-stone-200"
                >
                  <span className="min-w-0 flex-1 text-left truncate">
                    {t.states_36_full || 'Explore 36 States & UTs'}
                  </span>
                  <Compass className="w-4 h-4 text-[#e0231c] shrink-0" />
                </button>


                {/* Remote Sanctuary Zero-Data Offline Mode Switcher */}
                {onToggleOfflineMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onToggleOfflineMode();
                    }}
                    className={`btn-glass-clay w-full py-2.5 px-3.5 text-sm font-semibold flex items-center justify-between gap-4 cursor-pointer ${
                      isOfflineMode
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 shadow-[0_0_16px_rgba(16,185,129,0.35)]'
                        : 'btn-glass-clay-secondary text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                      {isOfflineMode ? (
                        <WifiOff className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                      ) : (
                        <Wifi className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0" />
                      )}
                      <span className="truncate">
                        {isOfflineMode
                          ? (t.offline_on || 'Offline ON')
                          : (t.switch_to_online || 'Offline Mode')}
                      </span>
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${
                      isOfflineMode
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-400'
                    }`}>
                      {isOfflineMode ? 'Zero-Data' : 'Ready'}
                    </span>
                  </button>
                )}

                {/* Add Heritage Entry */}
                {onOpenContribute && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenContribute();
                    }}
                    className="btn-glass-clay btn-glass-clay-crimson w-full py-2.5 px-3.5 text-sm font-semibold flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                      <PlusCircle className="w-4 h-4 shrink-0" />
                      <span className="truncate">{t.add_btn || '+ Add'}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30 shrink-0">
                      Public
                    </span>
                  </button>
                )}

                {/* Admin Portal */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="btn-glass-clay btn-glass-clay-amber w-full py-2.5 px-3.5 text-sm font-semibold flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="truncate">{t.admin_btn || 'Admin'}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 shrink-0">
                    Passcode
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Footer Note inside Drawer */}
            <div className={`pt-4 border-t text-center ${darkMode ? 'border-white/10' : 'border-stone-200'}`}>
              <span className="text-[11px] text-stone-500 font-medium">
                {lang === 'hi' ? 'भारत दर्शन • डिजिटल धरोहर अभिलेखागार' : 'Bharat Darshan • Digital Heritage Archive'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
