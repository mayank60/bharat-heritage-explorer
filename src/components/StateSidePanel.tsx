import React, { useState, useEffect } from 'react';
import { X, Landmark, Compass, Utensils, BookOpen, Palette, ArrowRight, ExternalLink } from 'lucide-react';
import { State, HeritageItem, Food, Festival, Language } from '../types.ts';
import { LanguageKey, TRANSLATIONS } from '../i18n.ts';
import { STATES, HERITAGE_ITEMS, FOODS, FESTIVALS, LANGUAGES } from '../data/seedDatabase.ts';
import { getHeritageImageUrl, handleHeritageImageError } from '../utils/imageHelper.ts';
import { LazyHeritageImage } from './LazyHeritageImage.tsx';
import {
  getStateName,
  getStateOverview,
  getStateCulture,
  getStateFestivals,
  getStateFood,
  getStateLanguages,
  getStateArtCrafts,
  getFestivalSignificance,
  getFestivalCelebration,
  getFoodDescription,
  getHeritageTitle
} from '../data/hindiDescriptions.ts';

interface StateSidePanelProps {
  lang: LanguageKey;
  stateId: string | null;
  onClose: () => void;
  onSelectHeritageItem: (item: HeritageItem) => void;
}

export const StateSidePanel: React.FC<StateSidePanelProps> = ({
  lang,
  stateId,
  onClose,
  onSelectHeritageItem,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'overview' | 'culture' | 'festivals' | 'food' | 'languages' | 'monuments' | 'arts'>('overview');
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<{
    state: State;
    items: HeritageItem[];
    foods: Food[];
    festivals: Festival[];
    languages: Language[];
  } | null>(null);

  // Fetch full state record when stateId changes
  useEffect(() => {
    if (!stateId) {
      setStateData(null);
      return;
    }

    setLoading(true);
    fetch(`/api/states/${stateId}`)
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.success && data.state) {
          const dedupe = <T extends { id?: string }>(arr: T[] = []): T[] => {
            const seen = new Set<string>();
            return arr.filter((x) => {
              const k = x.id || JSON.stringify(x);
              if (seen.has(k)) return false;
              seen.add(k);
              return true;
            });
          };
          setStateData({
            state: data.state,
            items: dedupe(data.items),
            foods: dedupe(data.foods),
            festivals: dedupe(data.festivals),
            languages: dedupe(data.languages)
          });
        } else {
          throw new Error('Not found');
        }
      })
      .catch(() => {
        setLoading(false);
        const s = STATES.find((st) => st.id === stateId);
        if (s) {
          const dedupe = <T extends { id?: string }>(arr: T[] = []): T[] => {
            const seen = new Set<string>();
            return arr.filter((x) => {
              const k = x.id || JSON.stringify(x);
              if (seen.has(k)) return false;
              seen.add(k);
              return true;
            });
          };
          setStateData({
            state: s,
            items: dedupe(HERITAGE_ITEMS.filter((i) => i.state_id === stateId)),
            foods: dedupe(FOODS.filter((f) => f.state_id === stateId)),
            festivals: dedupe(FESTIVALS.filter((fe) => fe.state_id === stateId)),
            languages: dedupe(LANGUAGES.filter((l) => l.state_id === stateId)),
          });
        }
      });
  }, [stateId]);

  if (!stateId) return null;

  const state = stateData?.state;
  const items = stateData?.items || [];
  const foods = stateData?.foods || [];
  const festivals = stateData?.festivals || [];
  const languages = stateData?.languages || [];

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] lg:w-[560px] bg-[#FAF8F5] dark:bg-[#151413] border-l border-[#E5DFD5] dark:border-[#2C2926] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out"
      aria-label="State cultural details"
    >
      {/* Panel Header */}
      <div className="relative border-b border-[#E5DFD5] dark:border-[#2C2926] bg-[#F5F0E6] dark:bg-[#1C1A17] p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8B2E24] dark:text-[#E8998D]">
              <span>{state?.region || 'India'} Region</span>
              <span aria-hidden="true">·</span>
              <span>Capital: {state?.capital}</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[#1C1917] dark:text-[#FAF8F5]">
              {getStateName(state, lang) || 'Loading State...'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-glass-clay btn-glass-clay-icon w-8 h-8 rounded-full text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Tabs Segmented Bar */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            {t.tab_overview}
          </button>
          <button
            onClick={() => setActiveTab('culture')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${
              activeTab === 'culture'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            {t.tab_culture}
          </button>
          <button
            onClick={() => setActiveTab('festivals')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${
              activeTab === 'festivals'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            {t.tab_festivals}
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${
              activeTab === 'food'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            {t.tab_food}
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${
              activeTab === 'languages'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            {t.tab_languages}
          </button>
          <button
            onClick={() => setActiveTab('monuments')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${
              activeTab === 'monuments'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            {t.tab_monuments} ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('arts')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${
              activeTab === 'arts'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            {t.tab_arts}
          </button>
        </div>
      </div>

      {/* Panel Scrollable Body */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6">
        {loading ? (
          <div className="py-12 text-center text-sm text-[#78716C]">
            Loading cultural records for {stateId}...
          </div>
        ) : !state ? (
          <div className="py-12 text-center text-sm text-[#78716C]">
            State data unavailable.
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {(items[0]?.image_url || state.banner_url) && (
                  <div className="relative h-48 rounded-xl overflow-hidden border border-[#E5DFD5] dark:border-[#2C2926] shadow-xs">
                    <LazyHeritageImage
                      src={items[0]?.image_url || state.banner_url}
                      alt={state.name}
                      itemId={items[0]?.id}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end p-4 pointer-events-none">
                      <div className="text-white">
                        <div className="text-xs uppercase tracking-wider text-[#FDE68A] font-semibold">
                          {state.region} India
                        </div>
                        <div className="font-serif text-lg font-bold">{state.name}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-2">
                    Heritage Narrative
                  </h3>
                  <p className="text-sm text-[#383531] dark:text-[#D6D3D1] leading-relaxed font-serif">
                    {getStateOverview(state, lang)}
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] dark:bg-[#1E1C19] rounded-xl border border-[#E5DDD0] dark:border-[#38332E] space-y-2">
                  <div className="text-xs font-semibold text-[#8B2E24] dark:text-[#E8998D] uppercase tracking-wide">
                    Quick Cultural Facts
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-[#44403C] dark:text-[#D6D3D1]">
                    <div>
                      <span className="font-medium text-[#78716C] dark:text-[#A8A29E] block">Capital:</span>
                      {state.capital}
                    </div>
                    <div>
                      <span className="font-medium text-[#78716C] dark:text-[#A8A29E] block">Monuments:</span>
                      {items.length} Sites Indexed
                    </div>
                    <div>
                      <span className="font-medium text-[#78716C] dark:text-[#A8A29E] block">Coordinates:</span>
                      {state.lat.toFixed(2)}° N, {state.lng.toFixed(2)}° E
                    </div>
                    <div>
                      <span className="font-medium text-[#78716C] dark:text-[#A8A29E] block">Region:</span>
                      {state.region} India
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CULTURE */}
            {activeTab === 'culture' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1C1917] dark:text-[#FAF8F5] font-semibold text-sm">
                  <Compass className="w-4 h-4 text-[#8B2E24] dark:text-[#E8998D]" />
                  <span>Living Culture & Folklore</span>
                </div>
                <p className="text-sm text-[#383531] dark:text-[#D6D3D1] leading-relaxed">
                  {getStateCulture(state, lang)}
                </p>
              </div>
            )}

            {/* TAB 3: FESTIVALS */}
            {activeTab === 'festivals' && (
              <div className="space-y-4">
                <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                  {getStateFestivals(state, lang)}
                </p>

                <div className="space-y-3">
                  {festivals.map((fest, idx) => (
                    <div
                      key={`${fest.id}-${idx}`}
                      className="p-4 rounded-xl border border-[#E7E2DA] dark:border-[#2C2926] bg-white dark:bg-[#1E1C19] card-slide-item card-interactive-slide"
                      style={{ '--stagger-index': Math.min(idx, 15) } as React.CSSProperties}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#1C1917] dark:text-[#FAF8F5]">
                          {fest.name}
                        </h4>
                        <span className="text-[11px] font-medium text-[#8B2E24] dark:text-[#E8998D]">
                          {fest.month_or_season}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#57534E] dark:text-[#C7C2BA] leading-relaxed">
                        {getFestivalSignificance(fest, lang)}
                      </p>
                      <div className="mt-2 text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                        <strong>{lang === 'hi' ? 'उत्सव एवं अनुष्ठान:' : 'Ritual & Celebration:'}</strong> {getFestivalCelebration(fest, lang)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: FOOD */}
            {activeTab === 'food' && (
              <div className="space-y-4">
                <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                  {getStateFood(state, lang)}
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {foods.map((food, idx) => (
                    <div
                      key={`${food.id}-${idx}`}
                      className="p-3.5 rounded-xl border border-[#E7E2DA] dark:border-[#2C2926] bg-white dark:bg-[#1E1C19] flex items-start gap-3 card-slide-item card-interactive-slide"
                      style={{ '--stagger-index': Math.min(idx, 15) } as React.CSSProperties}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#F4ECE6] dark:bg-[#2A211D] text-[#8B2E24] dark:text-[#EFA397] flex items-center justify-center shrink-0">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
                            {food.name}
                          </h4>
                          <span className="text-[10px] font-medium text-[#78716C] dark:text-[#A8A29E]">
                            {food.dietary_type}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#57534E] dark:text-[#C7C2BA] leading-relaxed">
                          {food.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: LANGUAGES */}
            {activeTab === 'languages' && (
              <div className="space-y-4">
                <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                  {state.languages_desc}
                </p>

                <div className="space-y-3">
                  {languages.map((langItem, idx) => (
                    <div
                      key={`${langItem.id}-${idx}`}
                      className="p-4 rounded-xl border border-[#E7E2DA] dark:border-[#2C2926] bg-white dark:bg-[#1E1C19] card-slide-item card-interactive-slide"
                      style={{ '--stagger-index': Math.min(idx, 15) } as React.CSSProperties}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#1C1917] dark:text-[#FAF8F5]">
                          {langItem.name}
                        </h4>
                        <span className="text-xs text-[#78716C] dark:text-[#A8A29E] font-mono">
                          {langItem.script}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-[#78716C] dark:text-[#A8A29E]">Speakers: {langItem.speakers_count}</span>
                        <span className="text-[#8B2E24] dark:text-[#E8998D] font-medium">Greeting: "{langItem.greeting}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: MONUMENTS */}
            {activeTab === 'monuments' && (
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="text-xs text-[#78716C] py-6 text-center">
                    No monuments listed for this state yet.
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => onSelectHeritageItem(item)}
                      className="group p-3 rounded-xl border border-[#E7E2DA] dark:border-[#2C2926] hover:border-[#8B2E24] dark:hover:border-[#E8998D] hover:bg-[#F7F2EB] dark:hover:bg-[#25221F] transition-all cursor-pointer flex items-center gap-3 bg-white dark:bg-[#1E1C19] card-slide-item card-interactive-slide"
                      style={{ '--stagger-index': Math.min(idx, 15) } as React.CSSProperties}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-stone-200 dark:border-white/10">
                        <LazyHeritageImage
                          src={item.image_url}
                          alt={item.title}
                          itemId={item.id}
                          categoryId={item.category_id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                          <span>{item.period} Era</span>
                          {item.unesco_flag && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#8B2E24] dark:text-[#E8998D] font-semibold">UNESCO</span>
                            </>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-[#1C1917] dark:text-[#FAF8F5] truncate group-hover:text-[#8B2E24] dark:group-hover:text-[#E8998D]">
                          {getHeritageTitle(item.id, lang, item.title)}
                        </h4>
                        <p className="text-xs text-[#78716C] dark:text-[#A8A29E] truncate">
                          {item.location_name}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C8479] group-hover:text-[#8B2E24] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 7: ART & CRAFTS */}
            {activeTab === 'arts' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1C1917] dark:text-[#FAF8F5] font-semibold text-sm">
                  <Palette className="w-4 h-4 text-[#8B2E24] dark:text-[#E8998D]" />
                  <span>Handicrafts, Textiles & Traditional Guilds</span>
                </div>
                <p className="text-sm text-[#383531] dark:text-[#D6D3D1] leading-relaxed font-serif">
                  {state.art_crafts_desc}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
