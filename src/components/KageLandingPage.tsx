import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Award, MapPin, Compass, Landmark, Sparkles, Heart, Palette, Languages, Utensils, ArrowRight, Clock, RefreshCw, ChevronRight } from 'lucide-react';
import { LanguageKey, TRANSLATIONS } from '../i18n.ts';
import { SearchSuggestion } from '../types.ts';
import { STATES, HERITAGE_ITEMS } from '../data/seedDatabase.ts';
import {
  getHeritageTitle,
  getHeritageSummary,
  getStateName,
  getUIText
} from '../data/hindiDescriptions.ts';
import { sanitizeSearchQuery } from '../utils/security.ts';

export interface KageLandingPageProps {
  lang: LanguageKey;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectSuggestion: (item: SearchSuggestion) => void;
  onExploreState: () => void;
  onSelectCategoryQuick?: (cat: string) => void;
  className?: string;
}

export const KageLandingPage: React.FC<KageLandingPageProps> = ({
  lang,
  searchQuery,
  onSearchChange,
  onSelectSuggestion,
  onExploreState,
  onSelectCategoryQuick,
  className = '',
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cultural Pulse "Today in History" fact state
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * HERITAGE_ITEMS.length));
  const [pulseFade, setPulseFade] = useState(true);

  const activeFactItem = HERITAGE_ITEMS[factIndex] || HERITAGE_ITEMS[0];

  const handleNextFact = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPulseFade(false);
    setTimeout(() => {
      setFactIndex((prev) => (prev + 1) % HERITAGE_ITEMS.length);
      setPulseFade(true);
    }, 150);
  };

  // Auto-rotate fact periodically (every 12 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseFade(false);
      setTimeout(() => {
        setFactIndex((prev) => (prev + 1) % HERITAGE_ITEMS.length);
        setPulseFade(true);
      }, 200);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Debounced search suggestion fetch
  useEffect(() => {
    const cleanQuery = sanitizeSearchQuery(searchQuery);
    if (!cleanQuery || cleanQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/search-suggest?q=${encodeURIComponent(cleanQuery)}`)
        .then((res) => {
          if (!res.ok) throw new Error('API offline');
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            setSuggestions(data.suggestions || []);
          }
        })
        .catch(() => {
          // Static fallback
          const q = searchQuery.toLowerCase();
          const localSuggest: SearchSuggestion[] = [];
          STATES.forEach((s) => {
            const sName = getStateName(s, lang);
            if (s.name.toLowerCase().includes(q) || (s.hindi_name && s.hindi_name.toLowerCase().includes(q)) || sName.toLowerCase().includes(q)) {
              localSuggest.push({
                id: s.id,
                title: sName,
                category: 'State / UT',
                state_name: s.region,
                type: 'state',
                unesco: false,
              });
            }
          });
          HERITAGE_ITEMS.forEach((h) => {
            const hTitle = getHeritageTitle(h, lang);
            if (
              h.title.toLowerCase().includes(q) ||
              (h.hindi_title && h.hindi_title.toLowerCase().includes(q)) ||
              hTitle.toLowerCase().includes(q)
            ) {
              localSuggest.push({
                id: h.id,
                title: hTitle,
                category: h.category_id,
                state_name: h.state_id,
                unesco: !!h.unesco_flag,
                type: 'heritage',
              });
            }
          });
          setSuggestions(localSuggest.slice(0, 8));
        });
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery, lang]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const QUICK_CATEGORIES = [
    {
      id: 'monuments',
      label: lang === 'en' ? 'Monuments' : lang === 'hi' ? 'स्मारक' : lang === 'bn' ? 'স্মৃতিস্তম্ভ' : lang === 'ta' ? 'நினைவுச்சின்னங்கள்' : lang === 'te' ? 'స్మారకాలు' : lang === 'mr' ? 'स्मारके' : lang === 'gu' ? 'સ્મારકો' : 'ಸ್ಮಾರಕಗಳು',
      icon: Landmark
    },
    {
      id: 'festivals',
      label: lang === 'en' ? 'Festivals' : lang === 'hi' ? 'त्योहार' : lang === 'bn' ? 'উৎসব' : lang === 'ta' ? 'திருவிழாக்கள்' : lang === 'te' ? 'పండుగలు' : lang === 'mr' ? 'सण' : lang === 'gu' ? 'તહેવારો' : 'ಹಬ್ಬಗಳು',
      icon: Sparkles
    },
    {
      id: 'traditions',
      label: lang === 'en' ? 'Traditions' : lang === 'hi' ? 'परंपराएं' : lang === 'bn' ? 'ঐতিহ্য' : lang === 'ta' ? 'பாரம்பரியம்' : lang === 'te' ? 'సంప్రదాయాలు' : lang === 'mr' ? 'परंपरा' : lang === 'gu' ? 'પરંપરાઓ' : 'ಸಂಪ್ರದಾಯಗಳು',
      icon: Heart
    },
    {
      id: 'arts',
      label: lang === 'en' ? 'Art & Crafts' : lang === 'hi' ? 'कला व शिल्प' : lang === 'bn' ? 'শিল্প ও কারুশিল্প' : lang === 'ta' ? 'கலை & கைவினை' : lang === 'te' ? 'కళలు & చేనేత' : lang === 'mr' ? 'कला व हस्तकला' : lang === 'gu' ? 'કળા અને હસ્તકલા' : 'ಕಲೆ & ಕರಕುಶಲತೆ',
      icon: Palette
    },
    {
      id: 'languages',
      label: lang === 'en' ? 'Languages' : lang === 'hi' ? 'भाषाएं' : lang === 'bn' ? 'ভাষা' : lang === 'ta' ? 'மொழிகள்' : lang === 'te' ? 'భాషలు' : lang === 'mr' ? 'भाषा' : lang === 'gu' ? 'ભાષાઓ' : 'ಭಾಷೆಗಳು',
      icon: Languages
    },
    {
      id: 'food',
      label: lang === 'en' ? 'Cuisine' : lang === 'hi' ? 'खानपान' : lang === 'bn' ? 'রান্না' : lang === 'ta' ? 'உணவு' : lang === 'te' ? 'వంటకాలు' : lang === 'mr' ? 'खाद्यसंस्कृती' : lang === 'gu' ? 'વાનગીઓ' : 'ಆಹಾರ',
      icon: Utensils
    },
  ];

  return (
    <section
      id="hero"
      className={`relative overflow-hidden bg-[#faf7f2] dark:bg-[#05070a] text-stone-900 dark:text-[#dfe7e0] pt-12 sm:pt-16 pb-16 sm:pb-20 border-b border-stone-200 dark:border-white/[0.08] transition-colors w-full max-w-full min-w-0 ${className}`}
    >
      {/* Ambient Temple Light Glows (Cinematic Aura Bloom - GPU optimized) */}
      <div className="animate-cinematic-aura absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#e0231c]/10 dark:from-[#e0231c]/15 via-[#9333EA]/5 dark:via-[#9333EA]/10 to-transparent blur-2xl pointer-events-none transform-gpu" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#c9a24a]/12 dark:bg-[#c9a24a]/10 rounded-full blur-2xl pointer-events-none transform-gpu" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#e0231c]/10 rounded-full blur-2xl pointer-events-none transform-gpu" />

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full min-w-0 overflow-visible">
        {/* Curatorial Heritage Pill Badge */}
        <div className="animate-cinematic-badge flex items-center justify-center mb-5 sm:mb-6 w-full max-w-full min-w-0 px-2">
          <div className="group relative inline-flex items-center justify-center gap-1 xs:gap-1.5 px-2.5 xs:px-4 py-1.5 rounded-full text-[10.5px] xs:text-xs font-medium text-stone-800 dark:text-zinc-200 bg-white/50 dark:bg-white/[0.07] hover:bg-white/70 dark:hover:bg-white/[0.12] border border-white/60 dark:border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] cursor-default shadow-[0_8px_24px_rgba(0,0,0,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.85)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.45),0_0_16px_rgba(224,35,28,0.12),inset_0_1px_1px_rgba(255,255,255,0.28)] overflow-hidden max-w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none rounded-full" />

            <span className="flex h-2 w-2 xs:h-2.5 xs:w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5a3c] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 xs:h-2.5 xs:w-2.5 bg-gradient-to-tr from-[#e0231c] to-[#ff7a59] shadow-[0_0_8px_rgba(255,90,60,0.8)]"></span>
            </span>
            <span className="font-semibold text-stone-900 dark:text-white tracking-wide uppercase text-[8px] xs:text-[10px] sm:text-[11px] drop-shadow-xs whitespace-nowrap shrink-0">
              {t.hero_archive_badge || 'Living Cultural Archive of India'}
            </span>
            <span className="text-stone-400 dark:text-white/30 shrink-0 font-bold select-none text-[8px] xs:text-[10px] sm:text-[11px] px-0.5">·</span>
            <span className="text-[#b4831b] dark:text-[#f3c969] font-bold text-[8px] xs:text-[10px] sm:text-[11px] tracking-wide drop-shadow-xs whitespace-nowrap shrink-0">
              {t.hero_national_repo || 'National Heritage Repository'}
            </span>
          </div>
        </div>

        {/* Hero Title with Saffron/Gold Accent */}
        <h1 className="animate-cinematic-title font-serif text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 dark:text-white max-w-4xl mx-auto leading-[1.12] sm:leading-[1.1] mb-4 sm:mb-6 break-words">
          <span className="relative bg-gradient-to-r from-[#e0231c] via-[#b4831b] to-[#e0231c] dark:from-[#ff5a3c] dark:via-[#c9a24a] dark:to-[#ff5a3c] bg-clip-text text-transparent">
            {t.hero_title || 'Bharat Heritage Explorer'}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-cinematic-subtitle text-xs xs:text-sm sm:text-lg text-stone-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-5 sm:mb-6 px-1">
          {t.hero_subtitle || 'Explore 36 States & Union Territories, UNESCO World Heritage monuments, living traditions, classical arts, sacred architecture, and indigenous cuisines.'}
        </p>

        {/* Floating "Cultural Pulse · Today in History" Banner */}
        {activeFactItem && (
          <div className="animate-cinematic-pulse max-w-2xl mx-auto mb-6 sm:mb-7 w-full min-w-0 relative z-20 overflow-visible">
            <div className="relative group overflow-visible">
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-amber-500/30 via-[#e0231c]/20 to-[#9333EA]/25 rounded-full blur-3xl opacity-50 group-hover:opacity-85 transition-all duration-700 pointer-events-none" />

              <div
                onClick={() => {
                  if (activeFactItem) {
                    onSelectSuggestion({
                      id: activeFactItem.id,
                      title: getHeritageTitle(activeFactItem, lang),
                      category: activeFactItem.category_id,
                      state_name: activeFactItem.state_id,
                      unesco: !!activeFactItem.unesco_flag,
                      type: 'heritage',
                    });
                  }
                }}
                className="relative flex items-center justify-between gap-2 xs:gap-3 p-2.5 xs:p-3 sm:px-4.5 sm:py-3 rounded-2xl bg-white/95 dark:bg-[#090d12]/95 border-2 border-amber-500/40 dark:border-amber-400/30 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] group-hover:border-[#c9a24a] group-hover:shadow-[0_0_30px_rgba(201,162,74,0.35)] cursor-pointer transition-all duration-300 text-left w-full max-w-full overflow-visible"
              >
                <div className="flex items-center gap-2.5 xs:gap-3.5 min-w-0 flex-1">
                  <div className="relative w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/25 via-[#e0231c]/20 to-purple-500/20 border border-amber-500/50 dark:border-amber-400/40 text-amber-500 flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(245,158,11,0.35)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(224,35,28,0.5)] transition-all duration-300">
                    <Sparkles className="w-4 h-4 xs:w-4.5 xs:h-4.5 text-amber-500 dark:text-amber-300 animate-spin-slow shrink-0" />
                    <span className="absolute inset-0 rounded-xl border border-amber-400/40 animate-ping opacity-25"></span>
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5a3c] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-tr from-[#e0231c] to-amber-400 shadow-[0_0_8px_rgba(255,90,60,0.9)]"></span>
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 mb-0.5">
                      <span className="text-[9px] xs:text-[10px] font-bold tracking-wider uppercase bg-[#e0231c]/15 text-[#e0231c] dark:text-[#ff7a59] px-2 py-0.5 rounded-md border border-[#e0231c]/30 shadow-[0_0_8px_rgba(224,35,28,0.2)] shrink-0">
                        {t.cultural_pulse || 'Cultural Pulse'}
                      </span>
                      <span className="text-[9px] xs:text-[10px] text-amber-700 dark:text-[#f3c969] font-bold flex items-center gap-1 shrink-0">
                        <Clock className="w-2.5 h-2.5 xs:w-3 xs:h-3 shrink-0 text-amber-500" />
                        {t.today_in_history || 'Today in History'}
                      </span>
                    </div>
                    <div className={`transition-opacity duration-200 min-w-0 ${pulseFade ? 'opacity-100' : 'opacity-0'}`}>
                      <p className="text-[11.5px] xs:text-xs font-bold text-stone-900 dark:text-white truncate">
                        <span className="text-amber-700 dark:text-[#f3c969] font-mono mr-1">[{activeFactItem.period}]</span>
                        {getHeritageTitle(activeFactItem, lang)}
                        <span className="font-normal text-stone-500 dark:text-zinc-400 ml-1 text-[10.5px] hidden sm:inline">
                          — {activeFactItem.location_name}
                        </span>
                      </p>
                      <p className="text-[10.5px] xs:text-[11px] text-stone-600 dark:text-zinc-300 truncate mt-0.5 font-medium">
                        {getHeritageSummary(activeFactItem, lang)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 xs:gap-2 shrink-0 ml-1 xs:ml-2">
                  <button
                    type="button"
                    onClick={handleNextFact}
                    className="btn-glass-clay btn-glass-clay-icon w-6 h-6 xs:w-7 xs:h-7 !rounded-lg text-stone-400 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer shadow-xs hover:rotate-180 transition-transform duration-500"
                    title={t.today_in_history || 'Shuffle'}
                    aria-label="Next Fact"
                  >
                    <RefreshCw className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                  </button>
                  <span className="text-[10px] xs:text-[11px] font-bold text-[#e0231c] dark:text-[#ff7a59] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span className="hidden xs:inline">{t.explore_btn || 'Explore'}</span>
                    <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* High-Contrast Floating Search Bar with Modern Heritage Lens */}
        <div ref={containerRef} className="animate-cinematic-search max-w-2xl mx-auto relative mb-8 w-full z-30">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#e0231c]/35 via-[#c9a24a]/40 to-[#9333EA]/35 rounded-[22px] blur-lg opacity-40 group-focus-within:opacity-100 group-hover:opacity-75 transition-all duration-500 pointer-events-none" />

            <div className="relative flex items-center bg-white/95 dark:bg-[#070a0e]/95 border-2 border-stone-200 dark:border-white/15 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.7)] group-focus-within:border-[#c9a24a] group-focus-within:shadow-[0_0_32px_rgba(201,162,74,0.35),0_0_48px_rgba(224,35,28,0.25)] transition-all duration-300 backdrop-blur-md">
              <div className="pl-3.5 xs:pl-4 pr-2 flex items-center justify-center shrink-0">
                <div className="relative w-8 h-8 xs:w-9 xs:h-9 rounded-xl bg-gradient-to-br from-[#e0231c]/15 via-[#c9a24a]/25 to-[#9333EA]/15 border border-[#c9a24a]/50 text-[#c9a24a] flex items-center justify-center shadow-inner group-focus-within:border-[#e0231c] group-focus-within:shadow-[0_0_14px_rgba(224,35,28,0.5)] group-focus-within:scale-105 transition-all duration-300">
                  <Compass className="w-4 h-4 xs:w-4.5 xs:h-4.5 text-[#e0231c] dark:text-[#ff5a3c] animate-pulse group-focus-within:rotate-45 transition-transform duration-500" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-tr from-amber-400 to-[#e0231c]"></span>
                  </span>
                </div>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t.search_placeholder}
                className="w-full py-3.5 xs:py-4 pr-3 text-xs xs:text-sm sm:text-base bg-transparent text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none font-medium"
              />

              <div className="flex items-center gap-1.5 xs:gap-2 mr-2.5 xs:mr-3 shrink-0">
                {!searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSearchChange('UNESCO');
                      setShowSuggestions(true);
                    }}
                    className="btn-unesco-special flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-[#c9a24a]/25 to-amber-500/20 border-2 border-amber-500/60 dark:border-amber-400/50 text-amber-900 dark:text-amber-200 text-xs font-bold cursor-pointer select-none shrink-0"
                    title="Explore UNESCO World Heritage Sites"
                  >
                    <div className="relative flex items-center justify-center">
                      <Award className="unesco-icon-target w-3.5 h-3.5 text-amber-600 dark:text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-60"></span>
                    </div>
                    <span className="font-extrabold tracking-wide text-[11.5px] uppercase font-mono bg-gradient-to-r from-amber-800 via-stone-900 to-amber-800 dark:from-amber-200 dark:via-white dark:to-amber-300 bg-clip-text text-transparent">
                      UNESCO
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-amber-500/25 text-amber-900 dark:text-amber-100 font-bold border border-amber-500/40">
                      42+
                    </span>
                  </button>
                )}

                {searchQuery && (
                  <button
                    onClick={() => {
                      onSearchChange('');
                      setSuggestions([]);
                    }}
                    className="btn-glass-clay btn-glass-clay-icon w-7 h-7 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer shrink-0 shadow-sm"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-[#0a0e12]/98 border-2 border-amber-500/30 dark:border-white/20 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_28px_70px_rgba(0,0,0,0.85)] overflow-hidden z-50 text-left backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 bg-stone-100/90 dark:bg-white/[0.04] border-b border-stone-200 dark:border-white/10 text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400 flex items-center justify-between">
                <span>{getUIText('step_2_title', lang)}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">
                  {suggestions.length} {getUIText('records_label', lang)}
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-white/[0.06]">
                {suggestions.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      onSelectSuggestion(item);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-stone-100/80 dark:hover:bg-white/[0.08] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="btn-glass-clay btn-glass-clay-icon w-8 h-8 rounded-xl flex items-center justify-center text-stone-700 dark:text-zinc-300 group-hover:text-[#ff5a3c] transition-colors">
                        {item.type === 'state' ? (
                          <MapPin className="w-4 h-4" />
                        ) : item.unesco ? (
                          <Award className="w-4 h-4 text-amber-600 dark:text-[#c9a24a]" />
                        ) : (
                          <Compass className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-stone-900 dark:text-white group-hover:text-[#ff5a3c] transition-colors flex items-center gap-1.5">
                          <span>{item.title}</span>
                          {item.unesco && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-[#c9a24a]/20 text-amber-800 dark:text-[#c9a24a] font-mono border border-amber-300 dark:border-[#c9a24a]/40 font-bold shadow-xs">
                              UNESCO
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-zinc-400">
                          <span>{item.category}</span>
                          {item.state_name && <span> · {item.state_name}</span>}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 dark:text-zinc-600 group-hover:text-stone-900 dark:group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Category Discovery Pills */}
        <div className="animate-cinematic-pills flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-10">
          <span className="text-xs text-stone-500 dark:text-zinc-500 font-medium mr-1 uppercase tracking-wider">
            {getUIText('step_2_title', lang)}:
          </span>
          {QUICK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategoryQuick && onSelectCategoryQuick(cat.id)}
                className="btn-glass-clay btn-glass-clay-tab btn-glass-clay-tab-inactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-[#ff5a3c]" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Heritage Trust & Coverage Metrics */}
        <div className="animate-cinematic-stats grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-stone-200 dark:border-white/[0.08]">
          <div
            className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/[0.06] hover:border-stone-300 dark:hover:border-white/15 shadow-xs transition-all text-center card-slide-item card-interactive-slide"
            style={{ '--stagger-index': 1 } as React.CSSProperties}
          >
            <div className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-white">36</div>
            <div className="text-xs text-stone-500 dark:text-zinc-400 font-medium mt-0.5">
              {t.quick_stats_states || 'States & UTs Covered'}
            </div>
          </div>
          <div
            className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/[0.06] hover:border-stone-300 dark:hover:border-white/15 shadow-xs transition-all text-center card-slide-item card-interactive-slide"
            style={{ '--stagger-index': 2 } as React.CSSProperties}
          >
            <div className="font-serif font-bold text-2xl sm:text-3xl text-[#e0231c] dark:text-[#ff5a3c]">140+</div>
            <div className="text-xs text-stone-500 dark:text-zinc-400 font-medium mt-0.5">
              {t.quick_stats_monuments || 'Monument Chronicles'}
            </div>
          </div>
          <div
            className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/[0.06] hover:border-stone-300 dark:hover:border-white/15 shadow-xs transition-all text-center card-slide-item card-interactive-slide"
            style={{ '--stagger-index': 3 } as React.CSSProperties}
          >
            <div className="font-serif font-bold text-2xl sm:text-3xl text-amber-600 dark:text-[#c9a24a]">42</div>
            <div className="text-xs text-stone-500 dark:text-zinc-400 font-medium mt-0.5">
              {t.quick_stats_unesco || 'UNESCO World Heritage'}
            </div>
          </div>
          <div
            className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/[0.06] hover:border-stone-300 dark:hover:border-white/15 shadow-xs transition-all text-center card-slide-item card-interactive-slide"
            style={{ '--stagger-index': 4 } as React.CSSProperties}
          >
            <div className="font-serif font-bold text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400">100%</div>
            <div className="text-xs text-stone-500 dark:text-zinc-400 font-medium mt-0.5">
              {t.quick_stats_cuisines || 'Cuisines & Living Lore'}
            </div>
          </div>
        </div>

        {/* Scroll Action Prompt */}
        <div className="animate-cinematic-cta mt-8 flex justify-center">
          <button
            onClick={onExploreState}
            className="btn-glass-clay btn-glass-clay-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <span>{t.states_36_full || 'Explore 36 States & UTs Directory'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
