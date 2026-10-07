import React from 'react';
import { Wifi, WifiOff, ShieldCheck, Database, CheckCircle2, X } from 'lucide-react';
import { LanguageKey, TRANSLATIONS } from '../i18n.ts';

interface OfflineSanctuaryBannerProps {
  isOfflineMode: boolean;
  onToggleOffline: () => void;
  lang: LanguageKey;
  cachedCount: number;
}

export const OfflineSanctuaryBanner: React.FC<OfflineSanctuaryBannerProps> = ({
  isOfflineMode,
  onToggleOffline,
  lang,
  cachedCount,
}) => {
  if (!isOfflineMode) return null;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-emerald-100 border-b border-emerald-500/40 px-3 sm:px-6 py-2.5 shadow-lg relative z-30 animate-in slide-in-from-top-2 duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0">
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-emerald-300 font-mono text-[11px] uppercase tracking-wider mr-2">
              {t.offline_active || '📶 Remote Sanctuary Offline Mode Active'}
            </span>
            <span className="text-stone-300 hidden md:inline">
              {t.offline_desc || `Zero-Data Mode: 36 States & ${cachedCount}+ monuments fully accessible off-grid.`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
            <Database className="w-3 h-3" />
            <span>100% OFFLINE</span>
          </span>
          <button
            onClick={onToggleOffline}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer text-[11px]"
          >
            {t.switch_online || 'Switch to Online'}
          </button>
        </div>
      </div>
    </div>
  );
};
