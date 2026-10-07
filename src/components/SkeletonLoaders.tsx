import React from 'react';
import { Landmark, Sparkles, Video, Image as ImageIcon, MapPin, Award } from 'lucide-react';

/**
 * Universal Shimmer Box
 * Automatically responds to dark and light modes with royal Indian heritage gold/stone highlights
 */
export const ShimmerBox: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className = '', children }) => (
  <div
    className={`relative overflow-hidden bg-stone-200/80 dark:bg-white/[0.05] rounded-xl animate-heritage-shimmer ${className}`}
  >
    {children}
  </div>
);

/**
 * 1. Monument Card Skeleton
 * Exactly mirrors the proportions, layout, and visual rhythm of MonumentCard
 */
export const MonumentCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0a0e12]/95 rounded-2xl border border-stone-200/90 dark:border-white/10 overflow-hidden flex flex-col justify-between shadow-xs">
      <div>
        {/* Top Image Banner Skeleton */}
        <div className="relative h-48 sm:h-54 w-full bg-stone-200/90 dark:bg-[#121921] animate-heritage-shimmer overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            <Landmark className="w-12 h-12 text-stone-400 dark:text-stone-600 animate-pulse" />
          </div>

          {/* Floating badge placeholders */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <div className="w-20 h-5 rounded-full bg-stone-300/80 dark:bg-white/15 animate-pulse" />
          </div>
          <div className="absolute top-3 right-3 z-10">
            <div className="w-8 h-8 rounded-full bg-stone-300/80 dark:bg-white/15 animate-pulse" />
          </div>

          {/* Bottom gradient hint */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="w-24 h-4 rounded-md bg-stone-400/50 dark:bg-white/20 animate-pulse" />
            <div className="w-16 h-4 rounded-md bg-stone-400/50 dark:bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Card Body Skeleton */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Era & Category Pill Row */}
          <div className="flex items-center justify-between">
            <div className="w-28 h-4 rounded-full bg-stone-200 dark:bg-white/10 animate-pulse" />
            <div className="w-16 h-4 rounded-full bg-amber-500/20 animate-pulse" />
          </div>

          {/* Title Placeholder */}
          <div className="space-y-1.5">
            <div className="w-4/5 h-5 rounded-lg bg-stone-300/80 dark:bg-white/20 animate-pulse" />
            <div className="w-3/5 h-4 rounded-lg bg-stone-200 dark:bg-white/10 animate-pulse" />
          </div>

          {/* Summary Lines */}
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-3.5 rounded bg-stone-200/90 dark:bg-white/10 animate-pulse" />
            <div className="w-[92%] h-3.5 rounded bg-stone-200/80 dark:bg-white/10 animate-pulse" />
            <div className="w-[68%] h-3.5 rounded bg-stone-200/70 dark:bg-white/10 animate-pulse" />
          </div>

          {/* Structured Architectural Highlight Box */}
          <div className="p-3 rounded-xl bg-stone-100/90 dark:bg-white/[0.03] border border-stone-200/70 dark:border-white/5 space-y-2">
            <div className="w-32 h-3 rounded bg-amber-500/25 animate-pulse" />
            <div className="w-full h-3 rounded bg-stone-200 dark:bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Footer Row Skeleton */}
      <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 dark:border-white/5 mt-2 flex items-center justify-between">
        <div className="w-24 h-4 rounded bg-stone-200 dark:bg-white/10 animate-pulse" />
        <div className="w-20 h-7 rounded-xl bg-stone-200 dark:bg-white/10 animate-pulse" />
      </div>
    </div>
  );
};

/**
 * 2. Cultural Card Skeleton
 * Matches Festival, Tradition, Craft, and Food cards
 */
export const CulturalCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1C1A17] rounded-2xl border border-[#E5DFD5] dark:border-[#2C2926] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <div className="w-24 h-5 rounded-full bg-amber-500/15 animate-pulse" />
          <div className="w-20 h-4 rounded-md bg-stone-200 dark:bg-white/10 animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="w-3/4 h-5 rounded-lg bg-stone-300 dark:bg-white/20 animate-pulse" />
          <div className="w-1/2 h-3.5 rounded-lg bg-stone-200 dark:bg-white/10 animate-pulse" />
        </div>

        {/* Structured Lore / Highlight Boxes */}
        <div className="space-y-2.5 pt-1">
          <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-white/[0.02] border border-amber-500/20 space-y-2">
            <div className="w-28 h-3.5 rounded bg-amber-500/25 animate-pulse" />
            <div className="w-full h-3 rounded bg-stone-200 dark:bg-white/10 animate-pulse" />
            <div className="w-4/5 h-3 rounded bg-stone-200 dark:bg-white/10 animate-pulse" />
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200 dark:border-white/10 space-y-2">
            <div className="w-24 h-3.5 rounded bg-stone-300 dark:bg-white/20 animate-pulse" />
            <div className="w-full h-3 rounded bg-stone-200 dark:bg-white/10 animate-pulse" />
            <div className="w-2/3 h-3 rounded bg-stone-200 dark:bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[#EFE8DD] dark:border-[#2A2724] flex items-center justify-between">
        <div className="w-24 h-3 rounded bg-stone-200 dark:bg-white/10 animate-pulse" />
        <div className="w-16 h-3 rounded bg-amber-500/20 animate-pulse" />
      </div>
    </div>
  );
};

/**
 * 3. State Category Explorer Grid Skeleton
 * Renders a full 6-card shimmer grid tailored to the active category
 */
export const StateCategoryExplorerSkeleton: React.FC<{
  type?: 'monuments' | 'festivals' | 'traditions' | 'arts' | 'languages' | 'food';
  count?: number;
}> = ({ type = 'monuments', count = 6 }) => {
  const isMonument = type === 'monuments';

  return (
    <div
      role="status"
      aria-label="Loading cultural heritage content..."
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fadeIn"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} style={{ animationDelay: `${idx * 60}ms` }}>
          {isMonument ? <MonumentCardSkeleton /> : <CulturalCardSkeleton />}
        </div>
      ))}
    </div>
  );
};

/**
 * 4. Modal Hero Banner Skeleton
 */
export const ModalHeroBannerSkeleton: React.FC = () => {
  return (
    <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-stone-900 animate-heritage-shimmer shrink-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 opacity-30 text-amber-300">
        <Landmark className="w-12 h-12 animate-pulse" />
        <span className="text-xs uppercase tracking-widest font-mono">Loading Heritage Visual...</span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 flex flex-col justify-between p-4 sm:p-5 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="w-28 h-6 rounded-full bg-white/20 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 animate-pulse" />
            <div className="w-8 h-8 rounded-xl bg-white/20 animate-pulse" />
            <div className="w-8 h-8 rounded-xl bg-white/20 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-40 h-4 rounded-md bg-white/20 animate-pulse" />
          <div className="w-3/5 h-8 rounded-lg bg-white/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

/**
 * 5. Modal Video Player Skeleton
 * Provides a rich 16:9 placeholder while the YouTube iframe / stream initializes
 */
export const ModalVideoSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 16:9 Video Canvas Frame */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-stone-900 border border-amber-500/20 shadow-2xl flex flex-col items-center justify-center animate-heritage-shimmer">
        <div className="relative flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-red-600/80 text-white flex items-center justify-center shadow-lg border border-red-400/40 animate-pulse">
            <Video className="w-7 h-7" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center px-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300/90 font-mono">
              Loading Authentic Stream...
            </span>
            <span className="text-[11px] text-zinc-400 max-w-sm">
              Connecting to official high-definition documentary archive
            </span>
          </div>
        </div>

        {/* Bottom player controls bar shimmer */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-black/60 backdrop-blur-md px-4 flex items-center justify-between border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white/30 animate-pulse" />
            <div className="w-16 h-2 rounded bg-white/20 animate-pulse" />
          </div>
          <div className="w-24 h-2 rounded bg-white/20 animate-pulse" />
        </div>
      </div>

      {/* Video Action Button Chips Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/20 animate-pulse" />
          <div className="space-y-1">
            <div className="w-32 h-3.5 rounded bg-white/20 animate-pulse" />
            <div className="w-20 h-2.5 rounded bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="w-28 h-8 rounded-xl bg-white/15 animate-pulse" />
      </div>
    </div>
  );
};

/**
 * 6. Modal Overview Tab Skeleton
 */
export const ModalOverviewSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeIn">
      {/* AMASR Statutory Badge */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-48 h-4 rounded bg-amber-300/30 animate-pulse" />
            <div className="w-64 h-3 rounded bg-zinc-600 animate-pulse" />
          </div>
        </div>
        <div className="w-24 h-8 rounded-xl bg-white/10 animate-pulse" />
      </div>

      {/* Audio Narration Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-36 h-4 rounded bg-amber-300/30 animate-pulse" />
            <div className="w-48 h-3 rounded bg-zinc-600 animate-pulse" />
          </div>
        </div>
        <div className="w-32 h-8 rounded-xl bg-white/10 animate-pulse" />
      </div>

      {/* Executive Significance Box */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-amber-500/20 space-y-2.5">
        <div className="w-40 h-4 rounded bg-amber-400/30 animate-pulse" />
        <div className="w-full h-4 rounded bg-white/10 animate-pulse" />
        <div className="w-[90%] h-4 rounded bg-white/10 animate-pulse" />
        <div className="w-[70%] h-4 rounded bg-white/10 animate-pulse" />
      </div>

      {/* 3 Coordinates Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <div className="w-20 h-3 rounded bg-amber-400/30 animate-pulse" />
          <div className="w-24 h-4 rounded bg-white/20 animate-pulse" />
        </div>
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <div className="w-20 h-3 rounded bg-emerald-400/30 animate-pulse" />
          <div className="w-28 h-4 rounded bg-white/20 animate-pulse" />
        </div>
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <div className="w-20 h-3 rounded bg-blue-400/30 animate-pulse" />
          <div className="w-32 h-4 rounded bg-white/20 animate-pulse" />
        </div>
      </div>

      {/* Architectural Marvel Highlights */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
        <div className="w-48 h-4 rounded bg-amber-400/30 animate-pulse" />
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-black/30 border border-white/5 w-full h-10 animate-pulse" />
          <div className="p-3 rounded-lg bg-black/30 border border-white/5 w-full h-10 animate-pulse" />
          <div className="p-3 rounded-lg bg-black/30 border border-white/5 w-full h-10 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

/**
 * 7. Modal Gallery Grid Skeleton
 */
export const ModalGallerySkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="w-40 h-4 rounded bg-white/20 animate-pulse" />
        <div className="w-28 h-8 rounded-xl bg-white/10 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="aspect-square rounded-xl overflow-hidden bg-stone-900 border border-white/10 flex items-center justify-center animate-heritage-shimmer relative"
          >
            <ImageIcon className="w-8 h-8 text-stone-600 animate-pulse opacity-40" />
            <div className="absolute bottom-2 inset-x-2 h-3 rounded bg-black/60 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 8. Modal History & Culture Narrative Skeleton
 */
export const ModalNarrativeSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
        <div className="w-40 h-5 rounded bg-amber-400/30 animate-pulse" />
        <div className="space-y-2 pt-1">
          <div className="w-full h-4 rounded bg-white/10 animate-pulse" />
          <div className="w-[95%] h-4 rounded bg-white/10 animate-pulse" />
          <div className="w-[90%] h-4 rounded bg-white/10 animate-pulse" />
          <div className="w-[75%] h-4 rounded bg-white/10 animate-pulse" />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
        <div className="w-48 h-5 rounded bg-amber-400/30 animate-pulse" />
        <div className="space-y-2 pt-1">
          <div className="w-full h-4 rounded bg-white/10 animate-pulse" />
          <div className="w-[92%] h-4 rounded bg-white/10 animate-pulse" />
          <div className="w-[85%] h-4 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
