import React, { useState } from 'react';
import { Compass, Sparkles, Layers, ShieldCheck, Columns, BookOpen, Clock, Landmark } from 'lucide-react';
import { getTimeTravelData } from '../data/timeTravelData.ts';
import { LanguageKey, t } from '../i18n.ts';

interface KaalDrishtiViewerProps {
  itemId: string;
  itemTitle: string;
  lang: LanguageKey;
}

export const KaalDrishtiViewer: React.FC<KaalDrishtiViewerProps> = ({
  itemId,
  itemTitle,
  lang,
}) => {
  const data = getTimeTravelData(itemId, itemTitle);
  const [activeTab, setActiveTab] = useState<'both' | 'ancient' | 'present'>('both');

  const nameToDisplay = lang === 'hi' ? data.hindiName : data.name;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#e0231c]/10 to-purple-600/15 border-2 border-amber-500/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/25 text-amber-800 dark:text-amber-200 border border-amber-500/40 inline-flex items-center gap-1.5">
                <Landmark className="w-3 h-3 text-amber-700 dark:text-amber-300" />
                <span>{t('tab_timetravel', lang, undefined, 'Architectural Evolution')}</span>
              </span>
              <span className="text-[11px] font-mono text-stone-500 dark:text-zinc-400">
                {data.ancientPeriod}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
              {t('kaal_drishti_title', lang, { name: nameToDisplay }, `${nameToDisplay}: Ancient Glory vs Present Conservation`)}
            </h3>
            <p className="text-xs text-stone-600 dark:text-zinc-300 mt-0.5">
              <span className="font-semibold text-amber-700 dark:text-amber-300">{t('patron_architect_label', lang, undefined, 'Patron & Master Sthapatis:')}</span> {data.rulerArchitect}
            </p>
          </div>

          {/* Quick Perspective Switcher */}
          <div className="flex items-center gap-1 bg-stone-200/80 dark:bg-white/[0.08] p-1 rounded-xl border border-stone-300 dark:border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'both'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{t('side_by_side', lang, undefined, 'Side-by-Side')}</span>
            </button>
            <button
              onClick={() => setActiveTab('ancient')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ancient'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>{t('ancient_view', lang, undefined, 'Ancient')}</span>
            </button>
            <button
              onClick={() => setActiveTab('present')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'present'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('present_view', lang, undefined, 'Present')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pure Textual Architectural Comparison (Zero Photos - 100% Error-Free) */}
      <div className={`grid gap-4 ${activeTab === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Ancient Original Reconstruction Card */}
        {(activeTab === 'both' || activeTab === 'ancient') && (
          <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-4 sm:p-5 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-500/50 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{t('ancient_blueprint_title', lang, undefined, 'Original Antiquity Architecture')}</span>
              </span>
              <span className="text-xs font-mono text-stone-500">{data.ancientPeriod}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                <Landmark className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{t('ancient_blueprint_title', lang, undefined, 'Original Structural Blueprint & Elevation')}</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-amber-100/90 font-medium">
                {lang === 'hi' ? data.hindiAncientDescription : data.ancientDescription}
              </p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 text-stone-600 dark:text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span><strong>{t('dynasty_patron_label', lang, undefined, 'Dynasty & Patron:')}</strong> {data.rulerArchitect}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span><strong>{t('original_materials_label', lang, undefined, 'Original Materials:')}</strong> {lang === 'hi' ? 'प्राकृतिक पाषाण, शुष्क इंटरलॉकिंग चिनाई एवं धातु कलश' : 'Natural Khondalite/Granite, zero-mortar dry masonry'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Present Day ASI Conserved Card */}
        {(activeTab === 'both' || activeTab === 'present') && (
          <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4 sm:p-5 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/25 text-emerald-900 dark:text-emerald-200 border border-emerald-500/50 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('present_conservation_title', lang, undefined, 'Present Day (ASI Protected)')}</span>
              </span>
              <span className="text-xs font-mono text-stone-500">Grade-I Monument</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('present_conservation_title', lang, undefined, 'Surviving Structures & Conservation State')}</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-emerald-100/90 font-medium">
                {lang === 'hi' ? data.hindiPresentDescription : data.presentDescription}
              </p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 text-stone-600 dark:text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span><strong>{t('statutory_status_label', lang, undefined, 'Statutory Status:')}</strong> {lang === 'hi' ? 'AMASR अधिनियम, 1958 अंतर्गत राष्ट्रीय महत्व का स्मारक' : 'Centrally Protected Monument under AMASR Act 1958'}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span><strong>{t('preservation_grade_label', lang, undefined, 'Preservation Grade:')}</strong> {lang === 'hi' ? 'राष्ट्रीय ग्रेड-1 (संरक्षित व स्थिर)' : 'National Grade-I (Preserved & Stable)'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Architectural Dissection Table */}
      <div className="rounded-2xl border border-stone-200 dark:border-white/10 overflow-hidden bg-white/70 dark:bg-white/[0.03]">
        <div className="px-4 py-3 bg-stone-100 dark:bg-white/[0.06] border-b border-stone-200 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-200 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-500" />
            {t('architectural_dissection_title', lang, undefined, 'Architectural Dissection & Evolution')}
          </span>
          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
            Verified Archives
          </span>
        </div>

        <div className="divide-y divide-stone-200 dark:divide-white/10 text-xs">
          {data.architecturalHighlights.map((hl, idx) => (
            <div key={idx} className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 hover:bg-stone-50/50 dark:hover:bg-white/[0.02]">
              <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>{hl.feature}</span>
              </div>
              <div className="text-amber-900 dark:text-amber-300/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <span className="font-bold block text-[10px] uppercase text-amber-700 dark:text-amber-400 mb-0.5">
                  {t('in_antiquity', lang, undefined, 'In Antiquity')}
                </span>
                {hl.ancientState}
              </div>
              <div className="text-emerald-950 dark:text-emerald-200/90 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <span className="font-bold block text-[10px] uppercase text-emerald-700 dark:text-emerald-400 mb-0.5">
                  {t('present_status', lang, undefined, 'Present Status')}
                </span>
                {hl.presentState}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engineering Secret Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-100 border border-amber-500/40 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
              {t('ancient_engineering_secret', lang, undefined, 'Ancient Engineering Marvel Secret')}
            </h4>
            <p className="text-xs leading-relaxed text-zinc-300">
              {data.engineeringFeat}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
