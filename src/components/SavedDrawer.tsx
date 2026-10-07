import React from 'react';
import { X, Bookmark, Trash2, MapPin, ExternalLink, Compass } from 'lucide-react';
import { HeritageItem } from '../types.ts';
import { LanguageKey, TRANSLATIONS } from '../i18n.ts';
import { getHeritageImageUrl, handleHeritageImageError } from '../utils/imageHelper.ts';
import { LazyHeritageImage } from './LazyHeritageImage.tsx';

interface SavedDrawerProps {
  lang: LanguageKey;
  isOpen: boolean;
  onClose: () => void;
  savedItems: HeritageItem[];
  onRemoveSaved: (itemId: string) => void;
  onSelectItem: (item: HeritageItem) => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  lang,
  isOpen,
  onClose,
  savedItems,
  onRemoveSaved,
  onSelectItem
}) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end touch-none"
      onClick={onClose}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#0a0e12] text-stone-900 dark:text-[#dfe7e0] h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 dark:border-white/[0.08] flex items-center justify-between bg-stone-50 dark:bg-[#05070a]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#ff5a3c]" />
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              {t.nav_saved} ({savedItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-glass-clay btn-glass-clay-icon w-8 h-8 rounded-full text-stone-400 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close saved drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
          {savedItems.length === 0 ? (
            <div className="py-20 text-center px-4">
              <div className="btn-glass-clay btn-glass-clay-icon w-14 h-14 rounded-2xl mx-auto mb-3 bg-[#e0231c]/10 text-[#ff5a3c]">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                {lang === 'hi' ? 'कोई सहेजा गया धरोहर स्थल नहीं' : 'No Bookmarked Heritage Sites'}
              </h3>
              <p className="mt-1 text-xs text-stone-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                {t.saved_empty}
              </p>
            </div>
          ) : (
            savedItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="group p-3 rounded-2xl border border-stone-200 dark:border-white/10 hover:border-[#e0231c]/50 bg-stone-50 dark:bg-[#0a0e12]/90 transition-all flex items-center gap-3 shadow-xs card-slide-item card-interactive-slide"
                style={{ '--stagger-index': idx } as React.CSSProperties}
              >
                <div
                  className="w-16 h-16 rounded-xl overflow-hidden shrink-0 cursor-pointer border border-stone-200 dark:border-white/10"
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                >
                  <LazyHeritageImage
                    src={item.image_url}
                    alt={item.title}
                    itemId={item.id}
                    categoryId={item.category_id}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                >
                  <div className="text-[11px] text-[#e0231c] dark:text-[#ff5a3c] font-semibold truncate">
                    {lang === 'hi' ? `${item.period} कालखंड` : `${item.period} Era`} {item.unesco_flag && '· UNESCO'}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white truncate group-hover:text-[#ff5a3c] transition-colors">
                    {lang === 'hi' && item.hindi_title ? item.hindi_title : item.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-zinc-400 truncate mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-700 dark:text-[#c9a24a] shrink-0" />
                    <span className="truncate">{item.location_name}</span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveSaved(item.id)}
                  className="btn-glass-clay btn-glass-clay-danger p-2 rounded-xl shrink-0 cursor-pointer"
                  title={lang === 'hi' ? 'सहेजे गए से हटाएं' : 'Remove from saved'}
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedItems.length > 0 && (
          <div className="p-4 border-t border-stone-200 dark:border-white/[0.08] bg-stone-50 dark:bg-[#05070a] text-xs text-stone-500 dark:text-zinc-400 flex items-center justify-between">
            <span>{lang === 'hi' ? 'सत्र में सुरक्षित' : 'Archived in curatorial session'}</span>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  savedItems.forEach((i) => onRemoveSaved(i.id));
                }}
                className="btn-glass-clay btn-glass-clay-danger px-3 py-1.5 text-xs font-semibold cursor-pointer"
              >
                {lang === 'hi' ? 'सभी हटाएं' : 'Clear All'}
              </button>
              <button
                onClick={onClose}
                className="btn-glass-clay btn-glass-clay-primary px-4 py-1.5 text-xs font-semibold cursor-pointer"
              >
                {lang === 'hi' ? 'पूर्ण' : 'Done'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
