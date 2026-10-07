import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, Image as ImageIcon, MapPin, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { State, Category, HeritageItem } from '../types.ts';
import { LanguageKey } from '../i18n.ts';
import { getHeritageImageUrl, handleHeritageImageError, OFFLINE_SVG_HERITAGE } from '../utils/imageHelper.ts';
import { addCommunityHeritage } from '../utils/cloudDatabase.ts';
import { sanitizeText, sanitizeImageUrl, checkSubmissionRateLimit } from '../utils/security.ts';

interface AddHeritageModalProps {
  isOpen: boolean;
  onClose: () => void;
  states: State[];
  categories: Category[];
  onHeritageAdded: (item: HeritageItem) => void;
  lang: LanguageKey;
}

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  monuments: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80',
  temples: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  forts: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
  caves: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
  museums: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=600&q=80',
  nature: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
};

const ERA_OPTIONS: Array<'Ancient' | 'Medieval' | 'Mughal' | 'Colonial' | 'Modern'> = [
  'Ancient',
  'Medieval',
  'Mughal',
  'Colonial',
  'Modern'
];

export const AddHeritageModal: React.FC<AddHeritageModalProps> = ({
  isOpen,
  onClose,
  states,
  categories,
  onHeritageAdded,
  lang,
}) => {
  const [title, setTitle] = useState('');
  const [hindiTitle, setHindiTitle] = useState('');
  const [stateId, setStateId] = useState(states[0]?.id || 'rajasthan');
  const [categoryId, setCategoryId] = useState('monuments');
  const [period, setPeriod] = useState<'Ancient' | 'Medieval' | 'Mughal' | 'Colonial' | 'Modern'>('Medieval');
  const [cityDistrict, setCityDistrict] = useState('');
  const [story, setStory] = useState('');
  const [keyHighlight, setKeyHighlight] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Active preview image (custom or auto category fallback)
  const previewImgSrc = customImageUrl.trim()
    ? getHeritageImageUrl(customImageUrl.trim(), undefined, categoryId)
    : (CATEGORY_DEFAULT_IMAGES[categoryId] || CATEGORY_DEFAULT_IMAGES.monuments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = sanitizeText(title);
    const cleanStory = sanitizeText(story);
    const cleanHindiTitle = sanitizeText(hindiTitle);
    const cleanCity = sanitizeText(cityDistrict);
    const cleanHighlight = sanitizeText(keyHighlight);

    if (!cleanTitle || !cleanStory) {
      setError(lang === 'hi' ? 'कृपया विरासत का नाम एवं विवरण अवश्य लिखें।' : 'Please provide the Heritage Title and Story/Description.');
      return;
    }

    // Anti-spam cooldown check (25 seconds between community additions)
    const rateCheck = checkSubmissionRateLimit('heritage_submit', 25);
    if (!rateCheck.allowed) {
      setError(
        lang === 'hi'
          ? `स्पैम सुरक्षा: कृपया नई प्रविष्टि जोड़ने से पहले ${rateCheck.remainingSeconds} सेकंड प्रतीक्षा करें।`
          : `Anti-spam cooldown: Please wait ${rateCheck.remainingSeconds}s before submitting another entry.`
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const fullLocation = cleanCity
      ? `${cleanCity}, ${states.find(s => s.id === stateId)?.name || 'India'}`
      : states.find(s => s.id === stateId)?.name || 'India';

    const selectedState = states.find(s => s.id === stateId);
    const baseLat = selectedState?.lat || 26.9124;
    const baseLng = selectedState?.lng || 75.7873;

    try {
      const finalItem = await addCommunityHeritage({
        title: cleanTitle,
        hindi_title: cleanHindiTitle || undefined,
        state_id: stateId,
        category_id: categoryId,
        period,
        location_name: fullLocation,
        summary: cleanStory,
        history: cleanHighlight ? `Highlight: ${cleanHighlight}. ${cleanStory}` : cleanStory,
        culture: cleanStory,
        image_url: previewImgSrc,
        video_url: '',
        timings: '08:00 AM - 06:00 PM',
        best_time: 'October to March',
        unesco_flag: false,
        lat: baseLat + (Math.random() - 0.5) * 0.1,
        lng: baseLng + (Math.random() - 0.5) * 0.1,
      });

      onHeritageAdded(finalItem);
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err?.message || (lang === 'hi' ? 'प्रविष्टि जोड़ने में त्रुटि हुई।' : 'Failed to add heritage entry.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setHindiTitle('');
    setCityDistrict('');
    setStory('');
    setKeyHighlight('');
    setCustomImageUrl('');
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto touch-none"
      onClick={onClose}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-[#0d1217] rounded-3xl shadow-2xl border border-stone-200 dark:border-white/10 overflow-hidden my-auto text-left animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-stone-100 via-amber-500/10 to-stone-100 dark:from-white/[0.04] dark:via-amber-500/10 dark:to-white/[0.02] border-b border-stone-200 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white">
                  {lang === 'hi' ? 'विरासत प्रविष्टि जोड़ें' : 'Contribute Heritage Entry'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>{lang === 'hi' ? 'जन सहभागिता' : 'Public Archive'}</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                {lang === 'hi'
                  ? 'अपने नगर, गांव या राज्य की विरासत को राष्ट्रीय अभिलेखागार में शामिल करें'
                  : 'Submit a historic landmark or living tradition to the national repository'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto overscroll-contain max-h-[calc(92vh-140px)]">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Basic Info: Title & Hindi Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'स्मारक / धरोहर का नाम *' : 'Heritage Title (English) *'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. सूर्य मंदिर, हवा महल' : 'e.g., Sun Temple, Amber Fort'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'हिंदी नाम (वैकल्पिक)' : 'Regional / Hindi Name (Optional)'}
              </label>
              <input
                type="text"
                value={hindiTitle}
                onChange={(e) => setHindiTitle(e.target.value)}
                placeholder="उदा. सूर्य मन्दिर, आमेर किला"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 2. State & Category Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'राज्य चुनें *' : 'State / UT *'}
              </label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {states.map((s) => (
                  <option key={s.id} value={s.id} className="bg-stone-900 text-white">
                    {s.name} ({s.capital})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'श्रेणी *' : 'Category *'}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-stone-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'शहर / जिला' : 'City / District'}
              </label>
              <input
                type="text"
                value={cityDistrict}
                onChange={(e) => setCityDistrict(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. गिरिडीह, देवघर' : 'e.g., Giridih, Deoghar'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 3. Era / Timeline Pill Selector */}
          <div>
            <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1.5">
              {lang === 'hi' ? 'ऐतिहासिक कालखंड (Era)' : 'Historical Era / Epoch'}
            </label>
            <div className="flex flex-wrap gap-2">
              {ERA_OPTIONS.map((er) => (
                <button
                  type="button"
                  key={er}
                  onClick={() => setPeriod(er)}
                  className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-all ${
                    period === er
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-100 dark:bg-white/[0.04] text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-white/10'
                  }`}
                >
                  {er} Era
                </button>
              ))}
            </div>
          </div>

          {/* 4. Single Unified Description / Story */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-700 dark:text-zinc-300 block">
                {lang === 'hi' ? 'विरासत का संक्षिप्त परिचय एवं कहानी *' : 'About this Heritage / Lore (2-3 sentences) *'}
              </label>
              <span className="text-[10px] text-stone-400">
                {story.length}/350
              </span>
            </div>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value.slice(0, 350))}
              placeholder={
                lang === 'hi'
                  ? 'इस धरोहर का ऐतिहासिक महत्व, स्थापत्य या मुख्य परंपरा क्या है? (2-3 पंक्तियों में बताएं)'
                  : 'Describe why this heritage site is special, its architectural wonder, or spiritual story...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              required
            />
          </div>

          {/* 5. Key Highlight & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'प्रमुख आकर्षण / मुख्य विशेषता' : 'Key Highlight / Unique Feature'}
              </label>
              <input
                type="text"
                value={keyHighlight}
                onChange={(e) => setKeyHighlight(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. अखंड चट्टान नक्काशी' : 'e.g., Monolithic rock carving, 108 temples'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'फोटो वेब लिंक (वैकल्पिक)' : 'Image URL (Auto-curated if empty)'}
              </label>
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://... (Leave empty for auto-photo)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 6. Visual Preview Pill */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200 dark:border-white/10 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 dark:bg-black/50 shrink-0 border border-stone-200 dark:border-white/10 relative">
              <img
                src={previewImgSrc}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => handleHeritageImageError(e, undefined, categoryId)}
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-stone-900 dark:text-white text-xs block truncate">
                {title || (lang === 'hi' ? 'आपकी नई प्रविष्टि' : 'Your New Heritage Entry')}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-zinc-400 block truncate">
                📍 {cityDistrict ? `${cityDistrict}, ` : ''}{states.find(s => s.id === stateId)?.name || 'India'} · {period} Era
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                <Check className="w-3 h-3" />
                <span>{lang === 'hi' ? 'सार्वजनिक रूप से सभी को दिखाई देगा' : 'Will sync to public national archive'}</span>
              </span>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-stone-200 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white font-medium cursor-pointer transition-colors"
            >
              {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-glass-clay btn-glass-clay-primary px-5 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{lang === 'hi' ? 'सहेजा जा रहा है...' : 'Publishing...'}</span>
              ) : (
                <>
                  <span>{lang === 'hi' ? 'राष्ट्रीय अभिलेखागार में जोड़ें' : 'Publish to National Archive'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
