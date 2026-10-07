import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Image as ImageIcon, Check, AlertCircle, ArrowRight, RefreshCw, Upload, Camera } from 'lucide-react';
import { State, Category, HeritageItem } from '../types.ts';
import { LanguageKey } from '../i18n.ts';
import { getHeritageImageUrl, handleHeritageImageError } from '../utils/imageHelper.ts';
import { addCommunityHeritage } from '../utils/cloudDatabase.ts';
import { sanitizeText, sanitizeImageUrl, checkSubmissionRateLimit } from '../utils/security.ts';
import {
  fetchAuthenticHeritagePhotos,
  getAuthenticVirtualTourUrl,
  generateDynamicMonumentSvg,
} from '../utils/authenticMediaHelper.ts';

interface AddHeritageModalProps {
  isOpen: boolean;
  onClose: () => void;
  states: State[];
  categories: Category[];
  onHeritageAdded: (item: HeritageItem) => void;
  lang: LanguageKey;
}

const ERA_OPTIONS: Array<'Ancient' | 'Medieval' | 'Mughal' | 'Colonial' | 'Modern'> = [
  'Ancient',
  'Medieval',
  'Mughal',
  'Colonial',
  'Modern',
];

const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 900;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        } else {
          resolve((e.target?.result as string) || '');
        }
      };
      img.onerror = () => resolve((e.target?.result as string) || '');
      img.src = (e.target?.result as string) || '';
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

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

  // Auto-Fetch Authentic Photos from Wikipedia & Wikimedia Commons
  const [autoPhotos, setAutoPhotos] = useState<string[]>([]);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isFetchingPhoto, setIsFetchingPhoto] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const debounceTimerRef = useRef<any>(null);

  // Automatically search authentic photographs as user enters monument title
  useEffect(() => {
    const cleanName = title.trim();
    if (!cleanName || cleanName.length < 2 || customImageUrl.trim().startsWith('data:image/')) {
      if (!cleanName) setAutoPhotos([]);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      setIsFetchingPhoto(true);

      try {
        // 1. Primary search: Clean title directly (highest precision from Wikipedia & Wikimedia)
        let photos = await fetchAuthenticHeritagePhotos(cleanName, 6);

        // 2. Fallback: If 0 photos found and city/district entered, try with location context
        if (photos.length === 0 && cityDistrict.trim()) {
          photos = await fetchAuthenticHeritagePhotos(`${cleanName} ${cityDistrict.trim()}`, 6);
        }

        setAutoPhotos(photos);
        setActivePhotoIdx(0);
      } catch (err) {
        console.warn('Auto photo fetch error:', err);
      } finally {
        setIsFetchingPhoto(false);
      }
    }, 450);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [title, cityDistrict, customImageUrl]);

  if (!isOpen) return null;

  // Active preview image: User Custom/Uploaded -> Auto-Fetched Authentic Wikimedia Photo -> Dynamic Monument SVG
  const activeAutoPhoto = autoPhotos.length > 0 ? autoPhotos[activePhotoIdx] : null;
  const dynamicSvgFallback = generateDynamicMonumentSvg(
    title || 'Bharat Heritage',
    cityDistrict || states.find((s) => s.id === stateId)?.name,
    period,
    categoryId
  );

  const previewImgSrc = customImageUrl.trim()
    ? customImageUrl.trim()
    : activeAutoPhoto || dynamicSvgFallback;

  const handleDeviceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const compressed = await compressImageFile(file);
      if (compressed) {
        setCustomImageUrl(compressed);
      }
    } catch {
      setError(lang === 'hi' ? 'फोटो अपलोड करने में त्रुटि हुई।' : 'Error uploading photo.');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleCycleNextPhoto = () => {
    if (autoPhotos.length <= 1) return;
    setActivePhotoIdx((prev) => (prev + 1) % autoPhotos.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = sanitizeText(title);
    const cleanStory = sanitizeText(story);
    const cleanHindiTitle = sanitizeText(hindiTitle);
    const cleanCity = sanitizeText(cityDistrict);
    const cleanHighlight = sanitizeText(keyHighlight);

    if (!cleanTitle || !cleanStory) {
      setError(
        lang === 'hi'
          ? 'कृपया विरासत का नाम एवं विवरण अवश्य लिखें।'
          : 'Please provide the Heritage Title and Story/Description.'
      );
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
      ? `${cleanCity}, ${states.find((s) => s.id === stateId)?.name || 'India'}`
      : states.find((s) => s.id === stateId)?.name || 'India';

    const selectedState = states.find((s) => s.id === stateId);
    const baseLat = selectedState?.lat || 26.9124;
    const baseLng = selectedState?.lng || 75.7873;

    // Automatically curate authentic virtual tour YouTube documentary
    const virtualTour = getAuthenticVirtualTourUrl(cleanTitle, fullLocation);

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
        video_url: virtualTour.embedUrl,
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
    setAutoPhotos([]);
    setActivePhotoIdx(0);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#0c1015] rounded-3xl shadow-2xl border border-stone-200 dark:border-white/10 overflow-hidden text-left my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-white/10 flex items-center justify-between bg-stone-50 dark:bg-black/20">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 font-mono block">
              {lang === 'hi' ? 'सार्वजनिक राष्ट्रीय अभिलेखागार' : 'National Heritage Archive'}
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-white mt-0.5">
              {lang === 'hi' ? 'नई सांस्कृतिक विरासत जोड़ें' : 'Contribute Heritage Entry'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-glass-clay btn-glass-clay-icon w-8 h-8 rounded-full text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto overscroll-contain text-xs">
          {/* 1. Monument Title */}
          <div>
            <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
              {lang === 'hi' ? 'विरासत का नाम (अंग्रेजी में) *' : 'Heritage Title / Monument Name *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'hi' ? 'उदा. पलामू किला, गोलकुंडा फोर्ट...' : 'e.g., Palamu Forts, Golconda Fort, Bhojeshwar Temple...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 font-medium"
              required
            />
          </div>

          {/* Hindi Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'हिंदी में नाम (वैकल्पिक)' : 'Hindi Title (Optional)'}
              </label>
              <input
                type="text"
                value={hindiTitle}
                onChange={(e) => setHindiTitle(e.target.value)}
                placeholder="उदा. पलामू दुर्ग"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'श्रेणी' : 'Category'}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#12161D] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-[#12161D]">
                    {lang === 'hi' ? c.hindi_name : c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* State & City/District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'राज्य / केंद्र शासित प्रदेश' : 'State / Union Territory'}
              </label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#12161D] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {states.map((s) => (
                  <option key={s.id} value={s.id} className="bg-white dark:bg-[#12161D]">
                    {lang === 'hi' ? s.hindi_name : s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
                {lang === 'hi' ? 'ज़िला / स्थान' : 'District / City'}
              </label>
              <input
                type="text"
                value={cityDistrict}
                onChange={(e) => setCityDistrict(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. लातेहार, बेतला...' : 'e.g., Latehar, Giridih, Hampi...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Era / Epoch Selector */}
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

          {/* Story / Lore Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-700 dark:text-zinc-300 block">
                {lang === 'hi' ? 'विरासत का संक्षिप्त परिचय एवं कहानी *' : 'About this Heritage / Lore (2-3 sentences) *'}
              </label>
              <span className="text-[10px] text-stone-400">{story.length}/350</span>
            </div>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value.slice(0, 350))}
              placeholder={
                lang === 'hi'
                  ? 'इस धरोहर का ऐतिहासिक महत्व, स्थापत्य या मुख्य परंपरा क्या है? (2-3 पंक्तियों में बताएं)'
                  : 'Describe why this heritage site is special, its architectural wonder, or historical significance...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              required
            />
          </div>

          {/* Key Highlight */}
          <div>
            <label className="font-bold text-stone-700 dark:text-zinc-300 block mb-1">
              {lang === 'hi' ? 'प्रमुख आकर्षण / मुख्य विशेषता' : 'Key Highlight / Unique Feature'}
            </label>
            <input
              type="text"
              value={keyHighlight}
              onChange={(e) => setKeyHighlight(e.target.value)}
              placeholder={lang === 'hi' ? 'उदा. नागपुरिया दरवाजा, वन क्षेत्र में जुड़वा किले' : 'e.g., Twin fort ruins inside national park, Nagpuria Gate'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.04] border border-stone-300 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* SMART PHOTO SECTION: Auto-Curated from Wikimedia + Device Upload */}
          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/25 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-stone-900 dark:text-white text-xs">
                  {lang === 'hi' ? 'स्मारक की प्रामाणिक फोटो' : 'Authentic Monument Photo'}
                </span>
              </div>

              {/* Status / Count */}
              {isFetchingPhoto ? (
                <span className="text-[11px] text-amber-400 flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{lang === 'hi' ? 'विकिमीडिया से खोज रहे हैं...' : 'Finding authentic photo...'}</span>
                </span>
              ) : autoPhotos.length > 0 && !customImageUrl ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    ✓ {lang === 'hi' ? `विकिमीडिया फोटो (${activePhotoIdx + 1}/${autoPhotos.length})` : `Wikimedia Photo (${activePhotoIdx + 1}/${autoPhotos.length})`}
                  </span>
                  {autoPhotos.length > 1 && (
                    <button
                      type="button"
                      onClick={handleCycleNextPhoto}
                      className="text-[10px] text-amber-500 hover:text-amber-400 font-bold underline cursor-pointer"
                    >
                      {lang === 'hi' ? 'दूसरी फोटो देखें' : 'Next Photo'}
                    </button>
                  )}
                </div>
              ) : null}
            </div>

            {/* Discovered Photos Thumbnail Carousel (1-Tap Selection) */}
            {autoPhotos.length > 0 && !customImageUrl && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-zinc-400 block">
                  {lang === 'hi' ? 'प्रामाणिक तस्वीरें (पसंद की फोटो चुनें):' : 'Authentic photos found (tap to select):'}
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {autoPhotos.map((photoUrl, idx) => (
                    <button
                      key={photoUrl}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activePhotoIdx === idx
                          ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/30'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                      {activePhotoIdx === idx && (
                        <span className="absolute bottom-0.5 right-0.5 bg-amber-500 text-stone-950 rounded-full p-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Device Photo Upload Buttons: Gallery / Storage + Live Camera */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Option 1: Phone Gallery / Storage (NO capture attribute = opens file manager / media gallery) */}
              <label className="btn-glass-clay btn-glass-clay-primary px-3.5 py-2 text-white text-xs font-semibold rounded-xl cursor-pointer inline-flex items-center gap-2 shadow-sm">
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>{isUploadingPhoto ? 'Uploading...' : lang === 'hi' ? 'फोन गैलरी / स्टोरेज से चुनें' : 'Choose from Gallery / Files'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDeviceFileUpload}
                />
              </label>

              {/* Option 2: Live Camera (capture="environment") */}
              <label className="btn-glass-clay btn-glass-clay-secondary px-3 py-2 text-stone-300 hover:text-white text-xs font-semibold rounded-xl cursor-pointer inline-flex items-center gap-1.5 border border-white/10">
                <Camera className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'कैमरे से लें' : 'Camera'}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleDeviceFileUpload}
                />
              </label>

              {customImageUrl && (
                <button
                  type="button"
                  onClick={() => setCustomImageUrl('')}
                  className="text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {lang === 'hi' ? 'ऑटो-फोटो पर वापस जाएं' : 'Revert to Auto Photo'}
                </button>
              )}
            </div>

            {/* Optional Web URL Accordion/Input if desired */}
            <input
              type="url"
              value={customImageUrl.startsWith('data:') ? '' : customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder={lang === 'hi' ? 'या वेब इमेज लिंक पेस्ट करें (वैकल्पिक)...' : 'Or paste custom image link (optional)...'}
              className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-black/40 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-white placeholder-stone-400 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Visual Preview Pill (NEVER Taj Mahal or Konark for unmatched sites) */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 dark:bg-black/60 shrink-0 border border-stone-300 dark:border-white/15 relative">
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
                📍 {cityDistrict ? `${cityDistrict}, ` : ''}{states.find((s) => s.id === stateId)?.name || 'India'} · {period} Era
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                <Check className="w-3 h-3" />
                <span>
                  {customImageUrl
                    ? (lang === 'hi' ? '📸 आपकी अपनी अपलोड की गई फोटो' : '📸 Custom photo attached')
                    : autoPhotos.length > 0
                    ? (lang === 'hi' ? '✓ विकिमीडिया से प्रामाणिक फोटो सुरक्षित' : '✓ Verified Wikimedia photo attached')
                    : (lang === 'hi' ? '🎨 विशिष्ट सांस्कृतिक पहचान बैज' : '🎨 Dedicated cultural card generated')}
                </span>
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
