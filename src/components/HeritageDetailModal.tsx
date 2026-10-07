import React, { useState, useEffect } from 'react';
import {
  X,
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Calendar,
  Award,
  ExternalLink,
  Video,
  Compass,
  History,
  Volume2,
  VolumeX,
  ChevronRight,
  Image as ImageIcon,
  Navigation,
  Plus,
  Trash2,
  Printer,
  ShieldCheck,
  BookOpen,
  FileText,
  Music,
  Radio,
  Sparkles,
  Sliders,
  Globe,
  Camera,
} from 'lucide-react';
import { HeritageItem, MonumentPhoto } from '../types.ts';
import {
  fetchMonumentPhotos,
  addMonumentPhoto,
  deleteMonumentPhoto,
  subscribeToMonumentPhotos,
} from '../utils/cloudDatabase.ts';
import { sanitizeText, sanitizeImageUrl, checkSubmissionRateLimit } from '../utils/security.ts';
import {
  getHeritageTitle,
  getHeritageSummary,
  getHeritageHistory,
  getHeritageCulture,
} from '../data/hindiDescriptions.ts';
import { LanguageKey, TRANSLATIONS, AVAILABLE_LANGUAGES } from '../i18n.ts';
import { getHeritageImageUrl, handleHeritageImageError } from '../utils/imageHelper.ts';
import { fetchAuthenticHeritagePhotos, getAuthenticVirtualTourUrl } from '../utils/authenticMediaHelper.ts';
import { LazyHeritageImage } from './LazyHeritageImage.tsx';
import { PARASNATH_PERMANENT_GALLERY } from '../data/parasnathPermanentGallery.ts';
import { HeritageDossierModal } from './HeritageDossierModal.tsx';
import { KaalDrishtiViewer } from './KaalDrishtiViewer.tsx';
import { heritageSoundscape } from '../utils/heritageSoundscape.ts';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import { getStructuredDossier } from '../data/monumentStructuredDossiers.ts';
import {
  ModalHeroBannerSkeleton,
  ModalVideoSkeleton,
  ModalOverviewSkeleton,
  ModalGallerySkeleton,
  ModalNarrativeSkeleton
} from './SkeletonLoaders.tsx';

// Verified Historical Epigraphy & Script Archives for Classical Landmarks
const EPIGRAPHY_LOOKUP: Record<string, { script: string; scriptName: string; hindiName: string }> = {
  sanchi: { script: '𑀲𑀸𑀁𑀘𑀻', scriptName: 'Ashokan Brahmi Script (3rd c. BCE)', hindiName: 'अशोककालीन ब्राह्मी लिपि' },
  bodh: { script: '𑀩𑁄𑀥𑀕𑀬𑀸', scriptName: 'Classical Brahmi Epigraphy', hindiName: 'प्राचीन ब्राह्मी पुरालेख' },
  nalanda: { script: 'नालन्दा महाविहार', scriptName: 'Gupta Siddhamatrika Script', hindiName: 'गुप्त सिद्धमातृका लिपि' },
  konark: { script: 'କୋଣାର୍କ', scriptName: 'Medieval Kalinga Script', hindiName: 'मध्यकालीन कलिंग लिपि' },
  brihadisvara: { script: 'தஞ்சைப் பெருவுடையார்', scriptName: 'Imperial Chola Grantha / Tamil', hindiName: 'चोल ग्रंथ एवं प्राचीन तमिल' },
  thanjavur: { script: 'தஞ்சைப் பெருவுடையார்', scriptName: 'Imperial Chola Grantha / Tamil', hindiName: 'चोल ग्रंथ एवं प्राचीन तमिल' },
  hampi: { script: 'ಹಂಪೆ ವಿಜಯನಗರ', scriptName: 'Old Halegannada Epigraphy', hindiName: 'प्राचीन हळेगन्नड पुरालेख' },
  khajuraho: { script: 'खजूरवाटिका', scriptName: 'Chandela Nagari Inscription', hindiName: 'चंदेल कालीन नागरी लिपि' },
  ellora: { script: 'एलापुर कैलास', scriptName: 'Rashtrakuta Brahmi-Devanagari', hindiName: 'राष्ट्रकूट ब्राह्मी-नागरी' },
  ajanta: { script: 'अजिंठा लेणी', scriptName: 'Vakataka Brahmi Epigraphy', hindiName: 'वाकाटक ब्राह्मी पुरालेख' },
  taj: { script: 'تاج محل', scriptName: 'Imperial Mughal Thuluth Calligraphy', hindiName: 'मुगल कालीन सुलस सुलेख' },
  qutb: { script: 'قطب منار', scriptName: 'Early Sultanate Kufic Inscription', hindiName: 'सल्तनत कालीन कूफी पुरालेख' },
  meenakshi: { script: 'மதுரை மீனாட்சி', scriptName: 'Classical Pandya Grantha', hindiName: 'शास्त्रीय पांड्य ग्रंथ लिपि' },
  sun: { script: 'କୋଣାର୍କ', scriptName: 'Medieval Kalinga Script', hindiName: 'मध्यकालीन कलिंग लिपि' },
};

const getEpigraphy = (itemId: string, title: string) => {
  const combined = (itemId + ' ' + title).toLowerCase();
  const key = Object.keys(EPIGRAPHY_LOOKUP).find((k) => combined.includes(k));
  return key ? EPIGRAPHY_LOOKUP[key] : null;
};

// In-memory persistent gallery cache so user photos never disappear during session
const MEMORY_GALLERY_CACHE: Record<string, string[]> = {};

// In-memory per-monument cache for discovered archive photos
// Ensures Monument A's discovered photos never leak into Monument B,
// and preserves discovered photos for visited monuments without re-fetching
const MONUMENT_ARCHIVE_PHOTOS_CACHE = new Map<string, string[]>();

// Client-side image compressor: converts large photos (5-10MB) to optimized 70KB JPEGs
// This prevents LocalStorage QuotaExceededError and ensures photos persist permanently!
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
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
          resolve(canvas.toDataURL('image/jpeg', 0.72));
        } else {
          resolve((event.target?.result as string) || '');
        }
      };
      img.onerror = () => resolve((event.target?.result as string) || '');
      img.src = (event.target?.result as string) || '';
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

const getInitialGallery = (it: HeritageItem): string[] => {
  if (it.id === 'shikharji-parasnath' || it.id.includes('parasnath') || it.id.includes('shikharji')) {
    if (MEMORY_GALLERY_CACHE[it.id]?.length) {
      return MEMORY_GALLERY_CACHE[it.id];
    }
    try {
      const saved = localStorage.getItem(`gallery_${it.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userOnly = parsed.filter(
            (u: string) =>
              typeof u === 'string' &&
              !u.includes('unsplash.com') &&
              !u.includes('1544717305')
          );
          if (userOnly.length > 0) {
            MEMORY_GALLERY_CACHE[it.id] = userOnly;
            return userOnly;
          }
        }
      }
    } catch { /* ignore */ }
    MEMORY_GALLERY_CACHE[it.id] = PARASNATH_PERMANENT_GALLERY;
    return PARASNATH_PERMANENT_GALLERY;
  }

  if (MEMORY_GALLERY_CACHE[it.id]?.length) {
    return MEMORY_GALLERY_CACHE[it.id];
  }
  try {
    const saved = localStorage.getItem(`gallery_${it.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        MEMORY_GALLERY_CACHE[it.id] = parsed;
        return parsed;
      }
    }
  } catch { /* ignore */ }
  const defaults = it.gallery && it.gallery.length > 0 ? it.gallery : [];
  MEMORY_GALLERY_CACHE[it.id] = defaults;
  return defaults;
};

interface HeritageDetailModalProps {
  lang: LanguageKey;
  item: HeritageItem | null;
  allItems: HeritageItem[];
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (itemId: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onSelectRecommendedItem?: (item: HeritageItem) => void;
}

export const HeritageDetailModal: React.FC<HeritageDetailModalProps> = ({
  lang,
  item,
  allItems,
  onClose,
  isSaved,
  onToggleSave,
  onShowToast,
  onSelectRecommendedItem,
}) => {
  const t = TRANSLATIONS[lang];
  const [tab, setTab] = useState<'overview' | 'timetravel' | 'history' | 'culture' | 'video' | 'location' | 'gallery'>('overview');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Safety: stop audio drone and speech synthesis when modal unmounts
  useEffect(() => {
    return () => {
      heritageSoundscape.stopAmbientDrone();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  const [isAmbientDroneOn, setIsAmbientDroneOn] = useState(true);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [narrationLang, setNarrationLang] = useState<LanguageKey>(lang);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const [customGallery, setCustomGallery] = useState<string[]>(() => {
    if (!item) return [];
    return getInitialGallery(item);
  });

  // Real-time crowdsourced photo gallery state (Google Maps style photo contributions)
  const [crowdPhotos, setCrowdPhotos] = useState<MonumentPhoto[]>([]);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [contributorNameInput, setContributorNameInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    url: string;
    caption?: string;
    contributor?: string;
    photoId?: string;
    isCustomIndex?: number;
  } | null>(null);

  // Auto-discovered historical archive photos from Wikimedia Commons
  const [archivePhotos, setArchivePhotos] = useState<string[]>(() => {
    if (!item?.id) return [];
    return MONUMENT_ARCHIVE_PHOTOS_CACHE.get(item.id) || [];
  });
  const [isDiscoveringPhotos, setIsDiscoveringPhotos] = useState(false);

  // Critical fix: Whenever the active monument changes (or modal re-opens for another monument),
  // reset state so that Monument A's photos/videos/galleries never leak into Monument B!
  useEffect(() => {
    if (!item?.id) return;
    setCustomGallery(getInitialGallery(item));
    setArchivePhotos(MONUMENT_ARCHIVE_PHOTOS_CACHE.get(item.id) || []);
    setCrowdPhotos([]);
    setIsDiscoveringPhotos(false);
    setIsVideoLoaded(false);
    setHeroImageLoaded(false);
    setShowPhotoModal(false);
    setPhotoUrlInput('');
    setCaptionInput('');
  }, [item?.id]);

  // Auto-discover authentic archive photos when entering gallery if empty
  useEffect(() => {
    if (
      tab === 'gallery' &&
      item?.id &&
      customGallery.length === 0 &&
      crowdPhotos.length === 0 &&
      archivePhotos.length === 0 &&
      !isDiscoveringPhotos
    ) {
      setIsDiscoveringPhotos(true);
      fetchAuthenticHeritagePhotos(item.title, item.location_name, 6)
        .then((photos) => {
          if (Array.isArray(photos) && photos.length > 0) {
            setArchivePhotos(photos);
            MONUMENT_ARCHIVE_PHOTOS_CACHE.set(item.id, photos);
          }
        })
        .catch(() => {})
        .finally(() => setIsDiscoveringPhotos(false));
    }
  }, [tab, item?.id, customGallery.length, crowdPhotos.length, archivePhotos.length, isDiscoveringPhotos]);

  // Sync crowdsourced monument photos in real-time
  useEffect(() => {
    if (!item?.id) return;
    fetchMonumentPhotos(item.id).then((photos) => {
      if (Array.isArray(photos)) setCrowdPhotos(photos);
    });

    const unsub = subscribeToMonumentPhotos(item.id, (photos) => {
      if (Array.isArray(photos)) setCrowdPhotos(photos);
    });

    return () => {
      unsub();
    };
  }, [item?.id]);

  const handleAddCrowdPhoto = async (imageUrl: string, caption?: string, contributor?: string) => {
    if (!item?.id || !imageUrl.trim()) return;

    setIsSubmittingPhoto(true);
    try {
      const newP = await addMonumentPhoto({
        monument_id: item.id,
        image_url: imageUrl.trim(),
        caption: caption?.trim() || undefined,
        contributor_name: contributor?.trim() || (lang === 'hi' ? 'धरोहर यात्री' : 'Heritage Explorer'),
      });
      setCrowdPhotos((prev) => [newP, ...prev.filter((p) => p.id !== newP.id)]);
      onShowToast(
        lang === 'hi'
          ? '📸 फोटो जन-गैलरी में सफलतापूर्वक जोड़ दी गई!'
          : '📸 Photo added to gallery successfully!',
        'success'
      );
      setShowPhotoModal(false);
      setPhotoUrlInput('');
      setCaptionInput('');
    } catch {
      onShowToast(lang === 'hi' ? 'फोटो जोड़ने में त्रुटि हुई।' : 'Failed to publish photo.', 'error');
    } finally {
      setIsSubmittingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!item?.id) return;
    try {
      await deleteMonumentPhoto(photoId, item.id, 'asi@bharat');
      setCrowdPhotos((prev) => prev.filter((p) => p.id !== photoId));
      if (lightboxPhoto?.photoId === photoId) {
        setLightboxPhoto(null);
      }
      onShowToast(lang === 'hi' ? 'फोटो गैलरी से हटा दी गई।' : 'Photo removed from gallery.', 'info');
    } catch {
      onShowToast(lang === 'hi' ? 'फोटो हटाने में समस्या हुई।' : 'Failed to delete photo.', 'error');
    }
  };

  useEffect(() => {
    if (!item) return;
    setTab('overview');
    setHeroImageLoaded(false);
    setIsVideoLoaded(false);
    setCustomGallery(getInitialGallery(item));
  }, [item?.id]);

  useEffect(() => {
    setIsTabTransitioning(true);
    const timer = setTimeout(() => {
      setIsTabTransitioning(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [tab]);

  useEffect(() => {
    setNarrationLang(lang);
  }, [lang]);

  if (!item) return null;

  // Curate 3 "Discover More" recommendations from the same state or category
  const recommendations = allItems
    .filter((h) => h.id !== item.id && (h.state_id === item.state_id || h.period === item.period))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast(t.copy_link_toast, 'success');
  };

  // High-End Audio Tour & Ambient Soundscape (SpeechSynthesis + Web Audio API Tanpura Drone)
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      onShowToast('Audio tour readout is not supported on this browser.', 'error');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      heritageSoundscape.stopAmbientDrone();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();

      // Play soft sacred temple chime
      heritageSoundscape.playTempleChime();

      // Start meditative Tanpura harmonic drone at whisper level with auto-ducking for speech clarity
      if (isAmbientDroneOn) {
        heritageSoundscape.startAmbientDrone(0.04);
        heritageSoundscape.duckVolume(true);
      }

      const selectedLangObj = AVAILABLE_LANGUAGES.find((l) => l.code === narrationLang) || AVAILABLE_LANGUAGES[0];
      const titleToSpeak = getHeritageTitle(item, narrationLang);
      const summaryToSpeak = getHeritageSummary(item, narrationLang);
      const historyToSpeak = getHeritageHistory(item, narrationLang);

      const narrationText = `${titleToSpeak}. ${summaryToSpeak}. ${historyToSpeak}.`;
      
      const targetLang = selectedLangObj.ttsVoiceCode || 'hi-IN';
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.lang = targetLang;
      utterance.pitch = 1.0;
      utterance.rate = audioSpeed ? Math.min(Math.max(audioSpeed, 0.85), 1.05) : 0.95;

      // Select best matching authentic voice for clear pronunciation of Indian heritage terminology
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const cleanTarget = targetLang.toLowerCase().replace('_', '-');
        const prefix = cleanTarget.split('-')[0];

        // 1. Exact BCP-47 match
        let matchedVoice = voices.find(
          (v) => v.lang.toLowerCase().replace('_', '-') === cleanTarget
        );

        // 2. Best Indian regional voice matching prefix or country code
        if (!matchedVoice) {
          matchedVoice = voices.find((v) => {
            const vLang = v.lang.toLowerCase().replace('_', '-');
            return (
              vLang.startsWith(prefix) &&
              (vLang.includes('in') || v.name.toLowerCase().includes('india'))
            );
          });
        }

        // 3. Any voice matching language prefix
        if (!matchedVoice) {
          matchedVoice = voices.find((v) =>
            v.lang.toLowerCase().replace('_', '-').startsWith(prefix)
          );
        }

        // 4. Fallback to an authentic Indian voice (e.g. en-IN or hi-IN)
        if (!matchedVoice) {
          matchedVoice = voices.find((v) => {
            const vLang = v.lang.toLowerCase();
            const vName = v.name.toLowerCase();
            return (
              vLang.includes('in') ||
              vLang.includes('hi') ||
              vName.includes('india') ||
              vName.includes('hindi') ||
              vName.includes('rishi') ||
              vName.includes('veena')
            );
          });
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }
      
      utterance.onend = () => {
        setIsPlayingAudio(false);
        heritageSoundscape.duckVolume(false);
        heritageSoundscape.stopAmbientDrone();
      };
      
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        heritageSoundscape.duckVolume(false);
        heritageSoundscape.stopAmbientDrone();
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      onShowToast(
        `🎧 ${selectedLangObj.nativeLabel} Audio Guide (${selectedLangObj.label}) · Tanpura Soundscape`,
        'info'
      );
    }
  };

  const handleClose = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    heritageSoundscape.stopAmbientDrone();
    setIsPlayingAudio(false);
    onClose();
  };

  // Google Maps Directions link
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${item.title}, ${item.location_name}, India`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden touch-none"
      onClick={handleClose}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      <div
        className="relative w-full max-w-2xl lg:max-w-3xl max-h-[92vh] flex flex-col bg-[#0a0e12] text-[#dfe7e0] rounded-2xl shadow-2xl overflow-hidden border border-white/15 text-left animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Hero Banner */}
        <div className="relative h-40 sm:h-48 md:h-52 w-full shrink-0 bg-[#1C1917] overflow-hidden">
          {!heroImageLoaded && (
            <div className="absolute inset-0 z-0">
              <ModalHeroBannerSkeleton />
            </div>
          )}
          <img
            src={getHeritageImageUrl(item.image_url, item.id, item.category_id)}
            alt={item.title}
            onLoad={() => setHeroImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              heroImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onError={(e) => {
              setHeroImageLoaded(true);
              handleHeritageImageError(e, item.id, item.category_id);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 flex flex-col justify-between p-4 sm:p-5">
            {/* Top Modal Controls */}
            <div className="flex items-center justify-between gap-1.5">
              {item.unesco_flag ? (
                <span className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[#FDE68A] bg-black/75 border border-[#B45309]/60 px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-md shrink-0">
                  <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F59E0B]" />
                  <span>{lang === 'hi' ? 'यूनेस्को' : 'UNESCO'}</span>
                  <span className="hidden xs:inline">{lang === 'hi' ? 'धरोहर' : 'Heritage'}</span>
                </span>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Audio Narration Button */}
                <button
                  onClick={handleToggleAudio}
                  className={`btn-glass-clay btn-glass-clay-icon w-8 h-8 sm:w-9 sm:h-9 cursor-pointer shrink-0 ${
                    isPlayingAudio ? 'btn-glass-clay-primary text-white shadow-lg animate-pulse' : 'bg-black/60 hover:bg-black/80 text-white'
                  }`}
                  title={isPlayingAudio ? (lang === 'hi' ? 'ऑडियो रोकें' : 'Stop Narration') : (lang === 'hi' ? 'ऑडियो विवरण सुनें' : 'Listen to Audio Tour')}
                >
                  {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>

                <button
                  onClick={handleShare}
                  className="btn-glass-clay btn-glass-clay-icon w-8 h-8 sm:w-9 sm:h-9 bg-black/60 hover:bg-black/80 text-white cursor-pointer shrink-0"
                  title={lang === 'hi' ? 'लिंक साझा करें' : 'Share link'}
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Academic Dossier View & Download Button */}
                <button
                  onClick={() => setShowDossierModal(true)}
                  className="btn-glass-clay btn-glass-clay-icon w-8 h-8 sm:w-9 sm:h-9 bg-black/60 hover:bg-black/80 text-amber-300 hover:text-white cursor-pointer shrink-0"
                  title={lang === 'hi' ? 'शोध डॉसियर देखें व डाउनलोड करें (PDF)' : 'View & Download Academic Dossier (PDF)'}
                >
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={() => onToggleSave(item.id)}
                  className={`btn-glass-clay btn-glass-clay-icon w-8 h-8 sm:w-9 sm:h-9 cursor-pointer shrink-0 ${
                    isSaved ? 'btn-glass-clay-primary text-white shadow-lg' : 'bg-black/60 hover:bg-black/80 text-white'
                  }`}
                  title={isSaved ? (lang === 'hi' ? 'सहेजे गए से हटाएं' : 'Remove from saved') : (lang === 'hi' ? 'धरोहर सहेजें' : 'Save heritage item')}
                >
                  <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleClose}
                  className="btn-glass-clay btn-glass-clay-icon w-8 h-8 sm:w-9 sm:h-9 bg-black/60 hover:bg-black/80 text-white cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Title Lockup */}
            <div>
              <div className="flex items-center gap-2 text-xs text-[#FDE8E5] mb-1 font-medium">
                <span>{lang === 'hi' ? `${item.period} कालखंड` : `${item.period} Era`}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F59E0B]" />
                  {item.location_name}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                {getHeritageTitle(item, lang)}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Segmented Navigation Tabs */}
        <div className="flex items-center border-b border-white/[0.08] bg-[#070a0e] px-3 py-2 gap-1.5 sm:gap-2 text-xs font-semibold overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setTab('overview')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl cursor-pointer text-xs whitespace-nowrap shrink-0 ${
              tab === 'overview'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            {t.tab_overview}
          </button>
          <button
            onClick={() => setTab('timetravel')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer text-xs whitespace-nowrap shrink-0 ${
              tab === 'timetravel'
                ? 'bg-gradient-to-r from-amber-500/30 via-[#e0231c]/25 to-purple-600/30 border-amber-400 text-amber-300 font-bold shadow-md'
                : 'btn-glass-clay-tab-inactive text-amber-400/90'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>{t.tab_timetravel || (lang === 'hi' ? '🏛️ काल-दृष्टि' : '🏛️ Time-Travel')}</span>
          </button>
          <button
            onClick={() => setTab('history')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl cursor-pointer text-xs whitespace-nowrap shrink-0 ${
              tab === 'history'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            {t.history_tab}
          </button>
          <button
            onClick={() => setTab('culture')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl cursor-pointer text-xs whitespace-nowrap shrink-0 ${
              tab === 'culture'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            {t.architecture_tab}
          </button>
          <button
            onClick={() => setTab('video')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer text-xs whitespace-nowrap shrink-0 ${
              tab === 'video'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{t.tab_video || t.video_tab}</span>
          </button>
          <button
            onClick={() => setTab('location')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer text-xs whitespace-nowrap shrink-0 ${
              tab === 'location'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t.tab_location || (lang === 'hi' ? 'स्थान व दिशा' : 'Location')}</span>
          </button>
          <button
            onClick={() => setTab('gallery')}
            className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer text-xs whitespace-nowrap shrink-0 ${
              tab === 'gallery'
                ? 'btn-glass-clay-tab-active shadow-md'
                : 'btn-glass-clay-tab-inactive'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t.tab_gallery || (lang === 'hi' ? 'गैलरी' : 'Gallery')}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 sm:space-y-5 min-h-0">
          {tab === 'overview' && (
            isTabTransitioning ? (
              <ModalOverviewSkeleton />
            ) : (
            <div className="space-y-4 sm:space-y-5 animate-fadeIn">
              {/* Statutory AMASR Provenance & Conservation Card */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-950/20 via-[#12161D] to-transparent border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-amber-200">
                        {lang === 'hi' ? 'ए.एस.आई. राजपत्र अभिलेख संख्या' : 'ASI Gazette Registry ID'}:
                      </span>
                      <code className="px-2 py-0.5 rounded bg-black/60 text-amber-400 font-mono text-[11px] font-semibold border border-amber-500/30 tracking-wider">
                        {`ASI-${item.state_id.toUpperCase().slice(0, 3)}-${item.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || '0042'}`}
                      </code>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      {lang === 'hi'
                        ? 'प्राचीन संस्मारक तथा पुरातत्वीय स्थल और अवशेष अधिनियम, 1958 (AMASR Act) अंतर्गत केंद्र संरक्षित स्मारक'
                        : 'Centrally Protected Monument under Ancient Monuments & Archaeological Sites and Remains Act (AMASR 1958)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setShowDossierModal(true)}
                    className="btn-glass-clay btn-glass-clay-primary px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs mr-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'डॉसियर खोलें' : 'View Dossier'}</span>
                  </button>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{lang === 'hi' ? 'संरक्षण: स्थिर' : 'Stable • Grade-I'}</span>
                  </span>
                </div>
              </div>

              {/* Interactive Curated Audio Guide & Ambient Soundscape Player */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#e0231c]/10 to-purple-600/15 border-2 border-amber-500/35 shadow-lg space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleToggleAudio}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all shadow-md cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.7)] animate-pulse'
                          : 'bg-amber-500 text-stone-950 hover:bg-amber-400 hover:scale-105'
                      }`}
                      title={isPlayingAudio ? 'Pause Audio Guide' : 'Play Heritage Audio Guide'}
                    >
                      {isPlayingAudio ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">
                          {lang === 'hi' ? '🎧 विरासत ऑडियो गाइड एवं तानपुरा परिवेश' : '🎧 Heritage Audio Guide & Soundscape'}
                        </span>
                        {isPlayingAudio && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {isPlayingAudio
                          ? (lang === 'hi' ? 'तानपुरा नाद एवं मंदिर घंटी के साथ इतिहास श्रवण जारी...' : 'Narrating with meditative Tanpura harmonic drone & temple chime...')
                          : (lang === 'hi' ? 'प्रामाणिक इतिहास, स्थापत्य व संस्कृति का सजीव श्रवण' : 'Spoken history, architectural feats & living traditions')}
                      </p>
                    </div>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Ambient Tanpura Drone Toggle with Soundwave indicator */}
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isAmbientDroneOn;
                        setIsAmbientDroneOn(next);
                        if (next) {
                          heritageSoundscape.playTempleChime();
                          heritageSoundscape.startAmbientDrone(0.05);
                          onShowToast(lang === 'hi' ? '🎵 4-तार तानपुरा परिवेश प्रारंभ...' : '🎵 4-String Tanpura acoustic drone playing...', 'info');
                        } else {
                          heritageSoundscape.stopAmbientDrone();
                          onShowToast(lang === 'hi' ? 'तानपुरा बंद' : 'Tanpura muted', 'info');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isAmbientDroneOn
                          ? 'bg-amber-500/25 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                          : 'border-white/15 text-zinc-400 hover:text-white bg-black/40'
                      }`}
                      title="Toggle Meditative 4-String Tanpura Drone"
                    >
                      <Music className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'hi' ? 'तानपुरा नाद' : 'Tanpura Drone'}</span>
                      {isAmbientDroneOn && (
                        <span className="flex items-center gap-0.5 ml-1">
                          <span className="w-0.5 h-2.5 bg-amber-400 animate-pulse"></span>
                          <span className="w-0.5 h-3.5 bg-amber-300 animate-pulse delay-75"></span>
                          <span className="w-0.5 h-2 bg-amber-400 animate-pulse delay-150"></span>
                        </span>
                      )}
                    </button>

                    {/* Speed Selector */}
                    <div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-white/10">
                      {[0.8, 1.0, 1.2].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setAudioSpeed(spd)}
                          className={`px-1.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                            audioSpeed === spd
                              ? 'bg-amber-500 text-stone-950 shadow-xs'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    {/* Narration Language Switcher (8 Languages) */}
                    <div className="flex items-center gap-1 bg-black/40 rounded-xl px-2 py-0.5 border border-white/10">
                      <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                      <select
                        value={narrationLang}
                        onChange={(e) => setNarrationLang(e.target.value as LanguageKey)}
                        className="bg-transparent text-[10px] font-bold text-amber-200 focus:outline-none cursor-pointer pr-1"
                      >
                        {AVAILABLE_LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code} className="bg-stone-900 text-white">
                            {l.nativeLabel} ({l.label})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ancient Historical Script / Epigraphy Card if applicable */}
              {(() => {
                const epigraphy = getEpigraphy(item.id, item.title);
                if (!epigraphy) return null;
                return (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-white block">
                          {lang === 'hi' ? 'मूल ऐतिहासिक पुरालेख एवं लिपि' : 'Ancient Epigraphy & Historical Script'}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {lang === 'hi' ? epigraphy.hindiName : epigraphy.scriptName}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 font-serif text-amber-200 text-sm sm:text-base font-bold tracking-wide">
                      {epigraphy.script}
                    </div>
                  </div>
                );
              })()}

              {/* Ancient Historical Script / Epigraphy Card if applicable */}
              {(() => {
                const epigraphy = getEpigraphy(item.id, item.title);
                if (!epigraphy) return null;
                return (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-white block">
                          {lang === 'hi' ? 'मूल ऐतिहासिक पुरालेख एवं लिपि' : 'Ancient Epigraphy & Historical Script'}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {lang === 'hi' ? epigraphy.hindiName : epigraphy.scriptName}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 font-serif text-amber-200 text-sm sm:text-base font-bold tracking-wide">
                      {epigraphy.script}
                    </div>
                  </div>
                );
              })()}

              {/* 1. Executive Significance Card */}
              {(() => {
                const dossier = getStructuredDossier(item);
                return (
                  <>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-red-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'प्रमुख राष्ट्रीय एवं आध्यात्मिक महत्व' : 'Executive Significance & Spiritual Axis'}</span>
                      </div>
                      <p className="font-serif text-sm sm:text-base text-zinc-100 leading-relaxed">
                        {lang === 'hi' && dossier.hindiExecutiveSignificance
                          ? dossier.hindiExecutiveSignificance
                          : dossier.executiveSignificance}
                      </p>
                    </div>

                    {/* 2. Geopolitical & Geographical Context */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                          📍 {lang === 'hi' ? 'भौगोलिक निर्देशांक' : 'Coordinates'}
                        </span>
                        <span className="font-mono text-zinc-200 text-[11px] block">{dossier.geoContext.coordinates}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                          ⛰️ {lang === 'hi' ? 'भू-भाग व ऊंचाई' : 'Terrain & Elevation'}
                        </span>
                        <span className="text-zinc-200 text-[11px] block truncate">{dossier.geoContext.elevation}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
                          🏛️ {lang === 'hi' ? 'ए.एस.आई. प्रशासनिक वृत्त' : 'ASI Circle'}
                        </span>
                        <span className="text-zinc-200 text-[11px] block truncate">{dossier.geoContext.asiCircle}</span>
                      </div>
                    </div>

                    {/* 3. Key Architectural Highlights */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
                      <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'hi' ? 'प्रमुख स्थापत्य व इंजीनियरिंग विशेषताएं' : 'Key Architectural & Engineering Marvels'}</span>
                      </div>
                      <div className="space-y-2">
                        {(lang === 'hi' && dossier.hindiArchitecturalHighlights ? dossier.hindiArchitecturalHighlights : dossier.architecturalHighlights).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed p-2.5 rounded-lg bg-black/30 border border-white/5">
                            <span className="text-amber-400 font-bold shrink-0 mt-0.5">✦</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. Practical Pilgrim & Visitor Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-[#ff5a3c] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-white text-[11px] uppercase tracking-wider">
                            {lang === 'hi' ? 'दर्शन एवं प्रवेश समय' : 'Visiting Timings'}
                          </span>
                          <span className="text-zinc-300 text-xs mt-0.5 block">{dossier.visitorInfo.timings}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5">
                        <Calendar className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-white text-[11px] uppercase tracking-wider">
                            {lang === 'hi' ? 'सर्वोत्तम यात्रा ऋतु' : 'Best Season'}
                          </span>
                          <span className="text-zinc-300 text-xs mt-0.5 block">{dossier.visitorInfo.bestSeason}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-white text-[11px] uppercase tracking-wider">
                            {lang === 'hi' ? 'प्रवेश नियम व मर्यादा' : 'Entry Protocol & Dress Code'}
                          </span>
                          <span className="text-zinc-300 text-xs mt-0.5 block">{dossier.visitorInfo.entryRules}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5">
                        <Navigation className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-white text-[11px] uppercase tracking-wider">
                            {lang === 'hi' ? 'मार्ग व यात्रा सुझाव' : 'Route & Access Notes'}
                          </span>
                          <span className="text-zinc-300 text-xs mt-0.5 block">{dossier.visitorInfo.routeNotes}</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            )
          )}

          {tab === 'timetravel' && (
            <KaalDrishtiViewer
              itemId={item.id}
              itemTitle={item.title}
              lang={lang}
            />
          )}

          {tab === 'history' && (
            isTabTransitioning ? (
              <ModalNarrativeSkeleton />
            ) : (
            <div className="space-y-4 animate-fadeIn">
              {(() => {
                const dossier = getStructuredDossier(item);
                return (
                  <>
                    {/* 1. Royal Patronage & Lineage */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <Award className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'राजवंशीय संरक्षण एवं संस्थापक' : 'Royal Patronage & Founding Dynasty'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-100 font-medium leading-relaxed">
                        {dossier.history.patronage}
                      </p>
                    </div>

                    {/* 2. Sacred Lore & Foundational Legends */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                        <BookOpen className="w-4 h-4 text-[#ff5a3c]" />
                        <span>{lang === 'hi' ? 'पौराणिक गाथा एवं उत्पत्ति' : 'Sacred Lore & Foundational Legend'}</span>
                      </div>
                      <p className="font-serif text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {dossier.history.sacredLore}
                      </p>
                    </div>

                    {/* 3. Chronological Milestones Through Eras */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                        <History className="w-4 h-4 text-emerald-400" />
                        <span>{lang === 'hi' ? 'युगों में ऐतिहासिक विकासक्रम' : 'Chronological Milestones Through Eras'}</span>
                      </div>
                      <div className="space-y-2.5">
                        {dossier.history.evolutionEras.map((evo, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                              {evo.era}
                            </span>
                            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                              {evo.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deep Historical Narrative */}
                    <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
                      <p className="font-serif text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                        {getHeritageHistory(item, lang)}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            )
          )}

          {tab === 'culture' && (
            isTabTransitioning ? (
              <ModalNarrativeSkeleton />
            ) : (
            <div className="space-y-4 animate-fadeIn">
              {(() => {
                const dossier = getStructuredDossier(item);
                return (
                  <>
                    {/* 1. Masonry & Structural Style */}
                    <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-1.5">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                        <Compass className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'शैलकृत एवं स्थापत्य शैली वर्गीकरण' : 'Masonry Order & Structural Classification'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-100 font-semibold leading-relaxed">
                        {dossier.cultureArchitecture.masonryStyle}
                      </p>
                    </div>

                    {/* 2. Artisanal Nuances, Iconography & Acoustic Science */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'hi' ? 'शिल्पकला, गर्भगृह रचना एवं ध्वनि विज्ञान' : 'Artisanal Nuances, Iconography & Acoustics'}</span>
                      </div>
                      <p className="font-serif text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {dossier.cultureArchitecture.artisanalIconography}
                      </p>
                    </div>

                    {/* 3. Living Sacred Traditions & Annual Gatherings */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                        <Radio className="w-4 h-4 text-emerald-400" />
                        <span>{lang === 'hi' ? 'जीवंत धार्मिक परंपराएं एवं वार्षिक उत्सव' : 'Living Sacred Traditions & Annual Pujas'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {dossier.cultureArchitecture.livingTraditions}
                      </p>
                    </div>

                    {/* Curatorial Culture Text */}
                    <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
                      <p className="font-serif text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {getHeritageCulture(item, lang)}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            )
          )}

          {tab === 'video' && (() => {
            if (isTabTransitioning) {
              return <ModalVideoSkeleton />;
            }

            const MONUMENT_EXACT_VIDEOS: Record<string, { embed: string; watch: string }> = {
              'amber-fort': {
                embed: 'https://www.youtube.com/embed/z3z4Ka5b6NY',
                watch: 'https://youtu.be/z3z4Ka5b6NY?si=CqKCHnaChyO-XS1D',
              },
              'hawa-mahal': {
                embed: 'https://www.youtube.com/embed/u2ZpmMYjlJY',
                watch: 'https://youtu.be/u2ZpmMYjlJY?si=wQX6b1YzG1LKzYK6',
              },
              'mehrangarh-fort': {
                embed: 'https://www.youtube.com/embed/Keg7icC56Sg',
                watch: 'https://youtu.be/Keg7icC56Sg?si=9VdhQVPxiayOLjaM',
              },
              'jaisalmer-fort': {
                embed: 'https://www.youtube.com/embed/k3xEv7N-Arc',
                watch: 'https://youtu.be/k3xEv7N-Arc?si=ds_V3eZ6xoyEKyOF',
              },
              'jantar-mantar-jaipur': {
                embed: 'https://www.youtube.com/embed/aXfr6PWtl_U',
                watch: 'https://youtu.be/aXfr6PWtl_U?si=SgKA24-lh_N7m_5W',
              },
              'padmanabhaswamy-temple': {
                embed: 'https://www.youtube.com/embed/E3puJPb0uTQ',
                watch: 'https://youtu.be/E3puJPb0uTQ?si=ICBw_nYYb_xyW1_q',
              },
              'mattancherry-palace': {
                embed: 'https://www.youtube.com/embed/-ywpAKC0qpE',
                watch: 'https://youtu.be/-ywpAKC0qpE?si=zZuV5OoxUji1u9QA',
              },
              'bekal-fort': {
                embed: 'https://www.youtube.com/embed/gJoCjmD4fCU',
                watch: 'https://youtu.be/gJoCjmD4fCU?si=gypQaVbla4N_J6B0',
              },
              'alappuzha-backwaters': {
                embed: 'https://www.youtube.com/embed/LiKkQuKLncc',
                watch: 'https://youtu.be/LiKkQuKLncc?si=oQ3l5oX_JduMs36l',
              },
              'chinese-fishing-nets': {
                embed: 'https://www.youtube.com/embed/Jydgkil3r5g',
                watch: 'https://youtu.be/Jydgkil3r5g?si=Epm2V-VmaM8CLH6A',
              },
              'kalamandalam-kathakali': {
                embed: 'https://www.youtube.com/embed/S6W1zhoMHxw',
                watch: 'https://youtu.be/S6W1zhoMHxw?si=q-C_oLKRWP7PHoSI',
              },
              'brihadisvara-temple': {
                embed: 'https://www.youtube.com/embed/D3yBuyu_FOA',
                watch: 'https://youtu.be/D3yBuyu_FOA?si=cFlS0sTIevX9Mb-i',
              },
              'mahabalipuram-shore-temple': {
                embed: 'https://www.youtube.com/embed/vM_qM_HJe4U',
                watch: 'https://youtu.be/vM_qM_HJe4U?si=Kw3qhIPjvhfNpux-',
              },
              'meenakshi-amman-temple': {
                embed: 'https://www.youtube.com/embed/uGHfjT_ny8Q',
                watch: 'https://youtu.be/uGHfjT_ny8Q?si=0spL48uIUL0EHZxf',
              },
              'ramanathaswamy-temple': {
                embed: 'https://www.youtube.com/embed/JUtKlIGxASo',
                watch: 'https://youtu.be/JUtKlIGxASo?si=CSIWBCReOiDtABe_',
              },
              'nilgiri-mountain-railway': {
                embed: 'https://www.youtube.com/embed/gLUrGSAMBLw',
                watch: 'https://youtu.be/gLUrGSAMBLw?si=d0VUrT3jB4iB4Rmu',
              },
              'gangaikonda-cholapuram': {
                embed: 'https://www.youtube.com/embed/LgVOMSzbGOY',
                watch: 'https://www.youtube.com/live/LgVOMSzbGOY?si=MeBTk0gvO2tEQsjN',
              },
              'taj-mahal': {
                embed: 'https://www.youtube.com/embed/EWkDzLrhpXI',
                watch: 'https://youtu.be/EWkDzLrhpXI?si=C2d8Rs746Zb9YiYk',
              },
              'varanasi-ghats': {
                embed: 'https://www.youtube.com/embed/NjFf4Jfxq9Y',
                watch: 'https://youtu.be/NjFf4Jfxq9Y?si=3KlabWDC3Atgy08i',
              },
              'fatehpur-sikri': {
                embed: 'https://www.youtube.com/embed/ugrnxf-nj3A',
                watch: 'https://youtu.be/ugrnxf-nj3A?si=45fIxQLRNlV1wkps',
              },
              'sarnath-dhamek-stupa': {
                embed: 'https://www.youtube.com/embed/ktBcf1vI5XE',
                watch: 'https://www.youtube.com/live/ktBcf1vI5XE?si=x93rDS8Xgvt6Y3Ui',
              },
              'bara-imambara': {
                embed: 'https://www.youtube.com/embed/V383z-KyNRg',
                watch: 'https://youtu.be/V383z-KyNRg?si=eG89DSHzddfyHC-E',
              },
              'agra-fort': {
                embed: 'https://www.youtube.com/embed/RS5CZ0vlIVg',
                watch: 'https://youtu.be/RS5CZ0vlIVg?si=xjAdnVbYWOAXv5iv',
              },
              'ajanta-ellora-caves': {
                embed: 'https://www.youtube.com/embed/k1SE25mURhc',
                watch: 'https://youtu.be/k1SE25mURhc?si=g5ch5o0CxNgIZT2j',
              },
              'chhatrapati-shivaji-terminus': {
                embed: 'https://www.youtube.com/embed/xfZ9YdvN7Jo',
                watch: 'https://youtu.be/xfZ9YdvN7Jo?si=iwHriz-RoeJME8Bk',
              },
              'gateway-of-india': {
                embed: 'https://www.youtube.com/embed/wBkMLwATPUQ',
                watch: 'https://youtu.be/wBkMLwATPUQ?si=fUytrk7VmUrcQLQd',
              },
              'raigad-fort': {
                embed: 'https://www.youtube.com/embed/jNPyn9A0EHo',
                watch: 'https://youtu.be/jNPyn9A0EHo?si=J5hkYxGQmJm_ciMz',
              },
              'elephanta-caves': {
                embed: 'https://www.youtube.com/embed/3s8uB4Rlooc',
                watch: 'https://youtu.be/3s8uB4Rlooc?si=0_f2lJt2iKx28UWx',
              },
              'shaniwar-wada': {
                embed: 'https://www.youtube.com/embed/040n49InZ5A',
                watch: 'https://youtu.be/040n49InZ5A?si=caJZlYzX6EqhLm71',
              },
              'victoria-memorial': {
                embed: 'https://www.youtube.com/embed/dk81ehdTSnE',
                watch: 'https://youtu.be/dk81ehdTSnE?si=7Zx2PrspPQvjjN18',
              },
              'howrah-bridge': {
                embed: 'https://www.youtube.com/embed/HWOfmn7yT9s',
                watch: 'https://youtu.be/HWOfmn7yT9s?si=T1Y4XzTDGa4C7Cq1',
              },
              'bishnupur-terracotta-temples': {
                embed: 'https://www.youtube.com/embed/02wXVbI6u-I',
                watch: 'https://youtu.be/02wXVbI6u-I?si=xZ_f1YCC0iLCTzLp',
              },
              'santiniketan': {
                embed: 'https://www.youtube.com/embed/Z2Iz7YNu1_0',
                watch: 'https://youtu.be/Z2Iz7YNu1_0?si=mzvwZDv_UgWmonY7',
              },
              'dakshineswar-kali-temple': {
                embed: 'https://www.youtube.com/embed/46oUtA5RdVE',
                watch: 'https://youtu.be/46oUtA5RdVE?si=Nw-4rI0C0Oh5fvhB',
              },
              'sundarbans-mangroves': {
                embed: 'https://www.youtube.com/embed/YAuMCIdWjHE',
                watch: 'https://youtu.be/YAuMCIdWjHE?si=rtZL4K8fEI-zEQb7',
              },
              'statue-of-unity': {
                embed: 'https://www.youtube.com/embed/nSRUl-k3qWw',
                watch: 'https://youtu.be/nSRUl-k3qWw?si=gFwYZ-3ohDvZjIDB',
              },
              'rani-ki-vav': {
                embed: 'https://www.youtube.com/embed/tskNNEwUMmw',
                watch: 'https://youtu.be/tskNNEwUMmw?si=7bDSyprGHfEklWt7',
              },
              'sun-temple-modhera': {
                embed: 'https://www.youtube.com/embed/XQy-A1UvoBE',
                watch: 'https://youtu.be/XQy-A1UvoBE?si=9PHU7ftCBVHiw9fT',
              },
              'somnath-temple': {
                embed: 'https://www.youtube.com/embed/X0jQti_-tMo',
                watch: 'https://youtu.be/X0jQti_-tMo?si=3u_GumJXRpLRiqaL',
              },
              'hampi-monuments': {
                embed: 'https://www.youtube.com/embed/5ohMewO7Yok',
                watch: 'https://youtu.be/5ohMewO7Yok?si=_9tHufG3aYDHQ5Ip',
              },
              'mysore-palace': {
                embed: 'https://www.youtube.com/embed/AJ5gR7VBX18',
                watch: 'https://youtu.be/AJ5gR7VBX18?si=O3pbuM6Lynt8k3NY',
              },
              'gol-gumbaz-vijayapura': {
                embed: 'https://www.youtube.com/embed/Vr0V0OqLyXw',
                watch: 'https://youtu.be/Vr0V0OqLyXw?si=vOw9ex93KUTTnu-e',
              },
              'badami-cave-temples': {
                embed: 'https://www.youtube.com/embed/zHNJV5lC9kM',
                watch: 'https://youtu.be/zHNJV5lC9kM?si=87QwPQ3lHRri_Zos',
              },
              'khajuraho-monuments': {
                embed: 'https://www.youtube.com/embed/r5jtbIaJy3I',
                watch: 'https://youtu.be/r5jtbIaJy3I',
              },
              'sanchi-stupa': {
                embed: 'https://www.youtube.com/embed/ZrZtiP5_jUk',
                watch: 'https://youtu.be/ZrZtiP5_jUk',
              },
              'gwalior-fort': {
                embed: 'https://www.youtube.com/embed/-FG02VW4ZB4',
                watch: 'https://youtu.be/-FG02VW4ZB4',
              },
              'golden-temple-amritsar': {
                embed: 'https://www.youtube.com/embed/33vC4G1KRuY',
                watch: 'https://youtu.be/33vC4G1KRuY',
              },
              'jallianwala-bagh': {
                embed: 'https://www.youtube.com/embed/Qb1ySC0h5Mg',
                watch: 'https://youtu.be/Qb1ySC0h5Mg',
              },
              'virasat-e-khalsa': {
                embed: 'https://www.youtube.com/embed/XioD2gHNH8g',
                watch: 'https://youtu.be/XioD2gHNH8g',
              },
              'red-fort-delhi': {
                embed: 'https://www.youtube.com/embed/3rkyyID0rUk',
                watch: 'https://youtu.be/3rkyyID0rUk',
              },
              'qutub-minar': {
                embed: 'https://www.youtube.com/embed/t5zrHnQNsY0',
                watch: 'https://youtu.be/t5zrHnQNsY0',
              },
              'humayuns-tomb': {
                embed: 'https://www.youtube.com/embed/ssxjtxV72K8',
                watch: 'https://youtu.be/ssxjtxV72K8',
              },
              'india-gate': {
                embed: 'https://www.youtube.com/embed/oaghzCMqfEU',
                watch: 'https://youtu.be/oaghzCMqfEU',
              },
              'kalka-shimla-railway': {
                embed: 'https://www.youtube.com/embed/GC903tSr7GE',
                watch: 'https://youtu.be/GC903tSr7GE',
              },
              'hidimba-devi-temple': {
                embed: 'https://www.youtube.com/embed/5RAd-Xgf61g',
                watch: 'https://youtu.be/5RAd-Xgf61g',
              },
              'tabo-monastery': {
                embed: 'https://www.youtube.com/embed/yQWrkXTCGec',
                watch: 'https://youtu.be/yQWrkXTCGec',
              },
              'kedarnath-dham': {
                embed: 'https://www.youtube.com/embed/lITNOLKby_Y',
                watch: 'https://youtu.be/lITNOLKby_Y',
              },
              'badrinath-temple': {
                embed: 'https://www.youtube.com/embed/MHrQY7c0zSk',
                watch: 'https://youtu.be/MHrQY7c0zSk',
              },
              'jageshwar-dham': {
                embed: 'https://www.youtube.com/embed/d03rsEpwWOM',
                watch: 'https://youtu.be/d03rsEpwWOM',
              },
              'shalimar-bagh-srinagar': {
                embed: 'https://www.youtube.com/embed/6LAuDuUNCDc',
                watch: 'https://youtu.be/6LAuDuUNCDc',
              },
              'shankaracharya-temple': {
                embed: 'https://www.youtube.com/embed/AJEvjhuWsDg',
                watch: 'https://youtu.be/AJEvjhuWsDg',
              },
              'martand-sun-temple': {
                embed: 'https://www.youtube.com/embed/xMUcMsAKzto',
                watch: 'https://youtu.be/xMUcMsAKzto',
              },
              'thiksey-monastery': {
                embed: 'https://www.youtube.com/embed/O_EQA5Zv05s',
                watch: 'https://youtu.be/O_EQA5Zv05s',
              },
              'leh-palace': {
                embed: 'https://www.youtube.com/embed/K0JyjFFO2Tg',
                watch: 'https://youtu.be/K0JyjFFO2Tg',
              },
              'hemis-monastery': {
                embed: 'https://www.youtube.com/embed/jzuaMenxrr4',
                watch: 'https://youtu.be/jzuaMenxrr4',
              },
              'brahma-sarovar-kurukshetra': {
                embed: 'https://www.youtube.com/embed/0t48xgHFqV4',
                watch: 'https://youtu.be/0t48xgHFqV4',
              },
              'pinjore-gardens': {
                embed: 'https://www.youtube.com/embed/WmfsnPBvRhw',
                watch: 'https://youtu.be/WmfsnPBvRhw',
              },
              'rock-garden-chandigarh': {
                embed: 'https://www.youtube.com/embed/WTo6KXF47P4',
                watch: 'https://youtu.be/WTo6KXF47P4',
              },
              'capitol-complex-chandigarh': {
                embed: 'https://www.youtube.com/embed/lauqds38Cgc',
                watch: 'https://youtu.be/lauqds38Cgc',
              },
              'sheikh-chilli-tomb': {
                embed: 'https://www.youtube.com/embed/zb-za81Layg',
                watch: 'https://youtu.be/zb-za81Layg',
              },
              'sukhna-lake-chandigarh': {
                embed: 'https://www.youtube.com/embed/pg920SS7hLs',
                watch: 'https://youtu.be/pg920SS7hLs',
              },
              'konark-sun-temple': {
                embed: 'https://www.youtube.com/embed/7vEvvnrfEV8',
                watch: 'https://youtu.be/7vEvvnrfEV8',
              },
              'puri-jagannath-temple': {
                embed: 'https://www.youtube.com/embed/e2GCRbSR2oA',
                watch: 'https://youtu.be/e2GCRbSR2oA',
              },
              'lingaraja-temple': {
                embed: 'https://www.youtube.com/embed/FPa01zOaOMU',
                watch: 'https://youtu.be/FPa01zOaOMU',
              },
              'nalanda-mahavihara': {
                embed: 'https://www.youtube.com/embed/L83yFLlS9ys',
                watch: 'https://youtu.be/L83yFLlS9ys',
              },
              'mahabodhi-temple': {
                embed: 'https://www.youtube.com/embed/8_Rb04JWVcI',
                watch: 'https://youtu.be/8_Rb04JWVcI',
              },
              'barabar-caves': {
                embed: 'https://www.youtube.com/embed/5UCqm8qXUy8',
                watch: 'https://youtu.be/5UCqm8qXUy8',
              },
              'baidyanath-dham': {
                embed: 'https://www.youtube.com/embed/5G-FP7ciOkA',
                watch: 'https://youtu.be/5G-FP7ciOkA',
              },
              'maluti-temples': {
                embed: 'https://www.youtube.com/embed/6FpgsrZ3THE',
                watch: 'https://youtu.be/6FpgsrZ3THE',
              },
              'sirpur-heritage-site': {
                embed: 'https://www.youtube.com/embed/Sfxn1jYmC7c',
                watch: 'https://youtu.be/Sfxn1jYmC7c',
              },
              'chitrakote-falls': {
                embed: 'https://www.youtube.com/embed/Lr-wQgj_qOc',
                watch: 'https://youtu.be/Lr-wQgj_qOc',
              },
              'bhoramdeo-temple': {
                embed: 'https://www.youtube.com/embed/G5G1xUOh-TY',
                watch: 'https://youtu.be/G5G1xUOh-TY',
              },
              'kamakhya-temple': {
                embed: 'https://www.youtube.com/embed/ptqNln4dzQk',
                watch: 'https://youtu.be/ptqNln4dzQk',
              },
              'rang-ghar-sivasagar': {
                embed: 'https://www.youtube.com/embed/y5miS5eUwd8',
                watch: 'https://youtu.be/y5miS5eUwd8',
              },
              'kaziranga-park-heritage': {
                embed: 'https://www.youtube.com/embed/8cHFGVZPz1o',
                watch: 'https://youtu.be/8cHFGVZPz1o',
              },
              'tirumala-venkateswara': {
                embed: 'https://www.youtube.com/embed/ZzZg21YuAlM',
                watch: 'https://youtu.be/ZzZg21YuAlM',
              },
              'lepakshi-veerabhadra': {
                embed: 'https://www.youtube.com/embed/YA3_zsKDNmg',
                watch: 'https://youtu.be/YA3_zsKDNmg',
              },
              'borra-caves-araku': {
                embed: 'https://www.youtube.com/embed/pYJGZPOLWW4',
                watch: 'https://youtu.be/pYJGZPOLWW4',
              },
              'charminar-hyderabad': {
                embed: 'https://www.youtube.com/embed/l4VhFrYBKEU',
                watch: 'https://youtu.be/l4VhFrYBKEU',
              },
              'golconda-fort': {
                embed: 'https://www.youtube.com/embed/wq3a9rPan0M',
                watch: 'https://youtu.be/wq3a9rPan0M',
              },
              'ramappa-temple': {
                embed: 'https://www.youtube.com/embed/EhkG7VfO-xg',
                watch: 'https://youtu.be/EhkG7VfO-xg',
              },
              'basilica-bom-jesus': {
                embed: 'https://www.youtube.com/embed/phgy6pFZVF8',
                watch: 'https://youtu.be/phgy6pFZVF8',
              },
              'fort-aguada-goa': {
                embed: 'https://www.youtube.com/embed/iWOKYpqYj8U',
                watch: 'https://youtu.be/iWOKYpqYj8U',
              },
              'se-cathedral-goa': {
                embed: 'https://www.youtube.com/embed/BsEQE4Nsang',
                watch: 'https://youtu.be/BsEQE4Nsang',
              },
              'auroville-matrimandir': {
                embed: 'https://www.youtube.com/embed/y_d0LqC3OmI',
                watch: 'https://youtu.be/y_d0LqC3OmI',
              },
              'french-quarter-puducherry': {
                embed: 'https://www.youtube.com/embed/RzN-vZ8QfOk',
                watch: 'https://youtu.be/RzN-vZ8QfOk',
              },
              'aurobindo-ashram-puducherry': {
                embed: 'https://www.youtube.com/embed/1FZN31KYmgg',
                watch: 'https://youtu.be/1FZN31KYmgg',
              },
              'cellular-jail-port-blair': {
                embed: 'https://www.youtube.com/embed/Wk7AVsV9WFs',
                watch: 'https://youtu.be/Wk7AVsV9WFs',
              },
              'ross-island-andaman': {
                embed: 'https://www.youtube.com/embed/A-yOEloKUdU',
                watch: 'https://youtu.be/A-yOEloKUdU',
              },
              'radhanagar-beach-havelock': {
                embed: 'https://www.youtube.com/embed/8zH8Mqn33Qw',
                watch: 'https://youtu.be/8zH8Mqn33Qw',
              },
              'diu-fort-naida-caves': {
                embed: 'https://www.youtube.com/embed/Yxlivx68psI',
                watch: 'https://youtu.be/Yxlivx68psI',
              },
              'moti-daman-fort': {
                embed: 'https://www.youtube.com/embed/mdXfagKUjx4',
                watch: 'https://youtu.be/mdXfagKUjx4',
              },
              'dudhni-tribal-heritage': {
                embed: 'https://www.youtube.com/embed/nu5jRsIT8Eg',
                watch: 'https://youtu.be/nu5jRsIT8Eg',
              },
              'ujra-mosque-kavaratti': {
                embed: 'https://www.youtube.com/embed/yY9C0lQP1P0',
                watch: 'https://youtu.be/yY9C0lQP1P0',
              },
              'minicoy-lighthouse': {
                embed: 'https://www.youtube.com/embed/lCSwpYqsAik',
                watch: 'https://youtu.be/lCSwpYqsAik',
              },
              'bangaram-atoll-marine': {
                embed: 'https://www.youtube.com/embed/uOmA_ZRkyvY',
                watch: 'https://youtu.be/uOmA_ZRkyvY',
              },
              'rumtek-monastery': {
                embed: 'https://www.youtube.com/embed/5vXJilCLHpU',
                watch: 'https://youtu.be/5vXJilCLHpU',
              },
              'pemayangtse-monastery': {
                embed: 'https://www.youtube.com/embed/d-g-fHHcsVY',
                watch: 'https://youtu.be/d-g-fHHcsVY',
              },
              'rabdentse-ruins': {
                embed: 'https://www.youtube.com/embed/Pejny3grPqA',
                watch: 'https://youtu.be/Pejny3grPqA',
              },
              'living-root-bridges': {
                embed: 'https://www.youtube.com/embed/C3-WzvtFAa8',
                watch: 'https://youtu.be/C3-WzvtFAa8',
              },
              'mawlynnong-heritage': {
                embed: 'https://www.youtube.com/embed/IZrb7B5RVn0',
                watch: 'https://youtu.be/IZrb7B5RVn0',
              },
              'nohkalikai-falls': {
                embed: 'https://www.youtube.com/embed/cj0hzd16rSc',
                watch: 'https://youtu.be/cj0hzd16rSc',
              },
              'tawang-monastery': {
                embed: 'https://www.youtube.com/embed/mmgli0KuK2g',
                watch: 'https://youtu.be/mmgli0KuK2g',
              },
              'ita-fort-itanagar': {
                embed: 'https://www.youtube.com/embed/XD2MuPfmmUM',
                watch: 'https://youtu.be/XD2MuPfmmUM',
              },
              'malinithan-temple': {
                embed: 'https://www.youtube.com/embed/AJogZyi5dtc',
                watch: 'https://youtu.be/AJogZyi5dtc',
              },
              'kisama-heritage-village': {
                embed: 'https://www.youtube.com/embed/v44091U2NuM',
                watch: 'https://youtu.be/v44091U2NuM',
              },
              'kohima-war-cemetery': {
                embed: 'https://www.youtube.com/embed/I2ocmSrNvj0',
                watch: 'https://youtu.be/I2ocmSrNvj0',
              },
              'khonoma-green-village': {
                embed: 'https://www.youtube.com/embed/Bp2xpgQ8tag',
                watch: 'https://youtu.be/Bp2xpgQ8tag',
              },
              'kangla-fort-imphal': {
                embed: 'https://www.youtube.com/embed/7ZNK_3ZEaD0',
                watch: 'https://youtu.be/7ZNK_3ZEaD0',
              },
              'loktak-lake-keibul-lamjao': {
                embed: 'https://www.youtube.com/embed/oeiT85Y38tY',
                watch: 'https://youtu.be/oeiT85Y38tY',
              },
              'ina-war-memorial-moirang': {
                embed: 'https://www.youtube.com/embed/-HZwO8iHtGE',
                watch: 'https://youtu.be/HZwO8iHtGE',
              },
              'reiek-heritage-village': {
                embed: 'https://www.youtube.com/embed/oPO9SOw5ssM',
                watch: 'https://youtu.be/oPO9SOw5ssM',
              },
              'solomons-temple-aizawl': {
                embed: 'https://www.youtube.com/embed/S7WVlQN6Pqw',
                watch: 'https://youtu.be/S7WVlQN6Pqw',
              },
              'vantawng-falls-mizoram': {
                embed: 'https://www.youtube.com/embed/Qe7FUKrM8kc',
                watch: 'https://youtu.be/Qe7FUKrM8kc',
              },
              'ujjayanta-palace': {
                embed: 'https://www.youtube.com/embed/jOjALXTNcV8',
                watch: 'https://youtu.be/jOjALXTNcV8',
              },
              'unakoti-rock-sculptures': {
                embed: 'https://www.youtube.com/embed/Yvytl_Ug6kw',
                watch: 'https://youtu.be/Yvytl_Ug6kw',
              },
              'neermahal-water-palace': {
                embed: 'https://www.youtube.com/embed/50mAXnlIBnw',
                watch: 'https://youtu.be/50mAXnlIBnw',
              },
              'parasnath': {
                embed: 'https://www.youtube.com/embed/0kUlTwf9oZE',
                watch: 'https://youtu.be/0kUlTwf9oZE?si=CzpxcoU6qOlDcogd',
              },
              'shikharji': {
                embed: 'https://www.youtube.com/embed/0kUlTwf9oZE',
                watch: 'https://youtu.be/0kUlTwf9oZE?si=CzpxcoU6qOlDcogd',
              },
              'palamu': {
                embed: 'https://www.youtube.com/embed/K3CxFSEi8XM',
                watch: 'https://youtu.be/K3CxFSEi8XM',
              },
              'palamu-fort': {
                embed: 'https://www.youtube.com/embed/K3CxFSEi8XM',
                watch: 'https://youtu.be/K3CxFSEi8XM',
              },
              'palamu-forts': {
                embed: 'https://www.youtube.com/embed/K3CxFSEi8XM',
                watch: 'https://youtu.be/K3CxFSEi8XM',
              },
            };

            const normalizedId = (item.id || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const normalizedTitle = (item.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

            const exactVideo = Object.entries(MONUMENT_EXACT_VIDEOS).find(([key]) => {
              const k = key.toLowerCase();
              return (
                normalizedId === k ||
                (k.length > 4 && normalizedId.includes(k)) ||
                normalizedTitle === k ||
                (k.length > 4 && normalizedTitle.includes(k)) ||
                (normalizedTitle.length > 4 && k.includes(normalizedTitle))
              );
            })?.[1];

            // Filter out any obsolete/broken listType=search URLs
            const validRawUrl = (item.video_url && !item.video_url.includes('listType=search')) ? item.video_url : '';
            const autoTour = getAuthenticVirtualTourUrl(item.title, item.location_name, exactVideo?.embed || validRawUrl);

            const finalEmbedUrl = exactVideo?.embed || autoTour.embedUrl;
            const watchUrl = exactVideo?.watch || autoTour.watchUrl;

            return (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {lang === 'hi' ? 'आधिकारिक आभासी अन्वेषण एवं वृत्तचित्र' : 'Official Virtual Exploration & Documentary'}
                  </h3>
                  <a
                    href={watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass-clay btn-glass-clay-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'यूट्यूब पर सीधे देखें' : 'Watch Directly on YouTube'}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>

                {finalEmbedUrl ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-lg">
                    {!isVideoLoaded && (
                      <div className="absolute inset-0 z-10">
                        <ModalVideoSkeleton />
                      </div>
                    )}
                    <iframe
                      src={finalEmbedUrl}
                      title={`${item.title} Video Tour`}
                      className={`w-full h-full border-0 transition-opacity duration-500 ${
                        isVideoLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setIsVideoLoaded(true)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-stone-900/90 via-zinc-900/90 to-black/95 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
                    {item.image_url && (
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-sm pointer-events-none"
                        style={{ backgroundImage: `url(${item.image_url})` }}
                      />
                    )}
                    <div className="relative z-10 space-y-3 max-w-lg mx-auto">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 mx-auto shadow-lg shadow-red-900/20">
                        <Video className="w-7 h-7 text-red-500 fill-red-500/20" />
                      </div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                        {lang === 'hi'
                          ? `${item.title} आधिकारिक वृत्तचित्र एवं वीडियो पुरालेख`
                          : `${item.title} Official Documentary & Video Archives`}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-serif">
                        {lang === 'hi'
                          ? 'भारतीय पुरातत्व सर्वेक्षण (ASI), दूरदर्शन (DD India) एवं राज्य पर्यटन विभागों द्वारा निर्मित वृत्तचित्र एवं आभासी अन्वेषण।'
                          : 'Explore authentic high-definition documentaries, historical coverage, and 360° virtual tours directly on YouTube.'}
                      </p>
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                          href={watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-glass-clay btn-glass-clay-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg w-full sm:w-auto cursor-pointer"
                        >
                          <Video className="w-4 h-4 text-red-400" />
                          <span>{lang === 'hi' ? 'यूट्यूब पर वृत्तचित्र देखें' : 'Watch Documentary on YouTube'}</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                        </a>
                      </div>
                    </div>

                    {/* National Heritage Tour Player Option */}
                    <div className="relative z-10 pt-4 border-t border-white/10 text-left">
                      <details className="group rounded-xl bg-white/[0.03] border border-white/10 p-3.5 cursor-pointer">
                        <summary className="text-xs font-semibold text-amber-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>
                              {lang === 'hi'
                                ? 'राष्ट्रीय विश्व धरोहर वृत्तचित्र देखें (पर्यटन मंत्रालय)'
                                : 'Watch National World Heritage Tour (Ministry of Tourism)'}
                            </span>
                          </span>
                          <span className="text-[10px] text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="mt-3 aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-black">
                          <iframe
                            src={autoTour.nationalTourEmbed}
                            title="Incredible India National Heritage Tour"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-2">
                          {lang === 'hi'
                            ? 'नोट: यह भारत की प्रमुख विश्व धरोहरों का सामान्य परिचयात्मक वृत्तचित्र है।'
                            : 'Note: This is an overarching documentary celebrating the UNESCO World Heritage of India.'}
                        </p>
                      </details>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                  <span>
                    {lang === 'hi'
                      ? 'आधिकारिक सांस्कृतिक संरक्षण माध्यमों से प्रदत्त हाई-डेफिनिशन वृत्तचित्र।'
                      : 'High-definition documentary tour provided via official cultural preservation channels.'}
                  </span>
                  <a
                    href={watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
                  >
                    <span>{lang === 'hi' ? 'YouTube पर खोलें →' : 'Open Video in YouTube →'}</span>
                  </a>
                </div>
              </div>
            );
          })()}

          {tab === 'location' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="font-serif font-bold text-base text-white mb-2">
                  {lang === 'hi' ? 'भौगोलिक स्थिति एवं निर्देशांक' : 'Geographic Location & Coordinates'}
                </h4>
                <div className="space-y-2 text-xs text-zinc-300">
                  <p>
                    <strong className="text-white">{lang === 'hi' ? 'स्थान:' : 'Region:'}</strong> {item.location_name}
                  </p>
                  <p>
                    <strong className="text-white">{lang === 'hi' ? 'भौगोलिक निर्देशांक:' : 'Geographic Coordinates:'}</strong> {item.lat.toFixed(4)}° N, {item.lng.toFixed(4)}° E
                  </p>
                  <p>
                    <strong className="text-white">{lang === 'hi' ? 'उपयुक्त यात्रा काल:' : 'Best Travel Period:'}</strong> {item.best_time}
                  </p>
                </div>

                <div className="mt-4">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass-clay btn-glass-clay-primary inline-flex items-center gap-1.5 px-4 py-2 text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'Google Maps पर दिशा-निर्देश प्राप्त करें' : 'Get Directions on Google Maps'}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {tab === 'gallery' && (
            isTabTransitioning ? (
              <ModalGallerySkeleton />
            ) : (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'hi' ? 'सार्वजनिक व ऐतिहासिक फोटो गैलरी' : 'Public & Historical Photo Gallery'}</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {lang === 'hi'
                      ? `${crowdPhotos.length + customGallery.length} चित्र उपलब्ध (${crowdPhotos.length} जन-योगदान)`
                      : `${crowdPhotos.length + customGallery.length} photos available (${crowdPhotos.length} community contributed)`}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Option 1: Direct 1-Tap Photo Upload from Phone Storage / Gallery (No camera force!) */}
                  <label className="btn-glass-clay btn-glass-clay-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-md">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>{lang === 'hi' ? 'फोन गैलरी / स्टोरेज से' : 'Phone Gallery / Files'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        onShowToast(lang === 'hi' ? 'गैलरी से फोटो जोड़ी जा रही है...' : 'Adding photo from gallery...', 'info');
                        const compressed = await compressImage(f);
                        if (compressed) {
                          await handleAddCrowdPhoto(compressed);
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>

                  {/* Option 2: Live Camera (Direct hardware camera capture) */}
                  <label className="btn-glass-clay btn-glass-clay-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-stone-300 hover:text-white text-xs font-medium rounded-xl cursor-pointer border border-white/10">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'hi' ? 'कैमरा' : 'Camera'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        onShowToast(lang === 'hi' ? 'कैमरा फोटो जोड़ी जा रही है...' : 'Adding camera photo...', 'info');
                        const compressed = await compressImage(f);
                        if (compressed) {
                          await handleAddCrowdPhoto(compressed);
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>

                  {/* Auto-Discover Real Archive Photos */}
                  <button
                    type="button"
                    disabled={isDiscoveringPhotos}
                    onClick={async () => {
                      if (!item?.id) return;
                      setIsDiscoveringPhotos(true);
                      try {
                        // Search with clean monument title directly for highest accuracy
                        const photos = await fetchAuthenticHeritagePhotos(item.title, item.location_name, 6);
                        if (photos.length > 0) {
                          setArchivePhotos(photos);
                          MONUMENT_ARCHIVE_PHOTOS_CACHE.set(item.id, photos);
                          onShowToast(
                            lang === 'hi'
                              ? `🏛️ ${photos.length} प्रामाणिक ऐतिहासिक तस्वीरें खोजी गईं!`
                              : `🏛️ Found ${photos.length} authentic archive photos!`,
                            'success'
                          );
                        } else {
                          onShowToast(lang === 'hi' ? 'कोई नई तस्वीर नहीं मिली।' : 'No additional archive photos found.', 'info');
                        }
                      } catch {
                        onShowToast(lang === 'hi' ? 'तस्वीरें खोजने में समस्या हुई।' : 'Could not fetch archive photos.', 'error');
                      } finally {
                        setIsDiscoveringPhotos(false);
                      }
                    }}
                    className="btn-glass-clay btn-glass-clay-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-amber-300 hover:text-white text-xs font-medium rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isDiscoveringPhotos ? 'animate-spin text-amber-400' : ''}`} />
                    <span>
                      {isDiscoveringPhotos
                        ? (lang === 'hi' ? 'खोज रहे हैं...' : 'Discovering...')
                        : (lang === 'hi' ? 'पुरालेख फोटो खोजें' : 'Discover Archive Photos')}
                    </span>
                  </button>

                  {/* Optional Caption / Link details toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPhotoModal(!showPhotoModal)}
                    className="text-zinc-400 hover:text-white text-xs px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    title="Add custom caption or link"
                  >
                    {showPhotoModal ? '✕' : `+ ${lang === 'hi' ? 'विवरण / लिंक' : 'Link / Caption'}`}
                  </button>
                </div>
              </div>

              {/* Optional Caption / URL Drawer for users who want custom descriptions */}
              {showPhotoModal && (
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'फोटो शीर्षक या वेब लिंक जोड़ें' : 'Add Photo Link or Custom Caption'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPhotoModal(false)}
                      className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={contributorNameInput}
                      onChange={(e) => setContributorNameInput(e.target.value)}
                      placeholder={lang === 'hi' ? 'आपका नाम (वैकल्पिक)' : 'Your Name (Optional)'}
                      className="px-3 py-2 rounded-xl text-xs bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      value={captionInput}
                      onChange={(e) => setCaptionInput(e.target.value)}
                      placeholder={lang === 'hi' ? 'शीर्षक / विवरण (वैकल्पिक)' : 'Photo Caption (Optional)'}
                      className="px-3 py-2 rounded-xl text-xs bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="url"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder={lang === 'hi' ? 'वेब इमेज लिंक (HTTPS URL)...' : 'Paste Image Web Link (HTTPS URL)...'}
                      className="w-full sm:flex-1 px-3 py-2 rounded-xl text-xs bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      disabled={!photoUrlInput.trim() || isSubmittingPhoto}
                      onClick={() => handleAddCrowdPhoto(photoUrlInput, captionInput, contributorNameInput)}
                      className="btn-glass-clay btn-glass-clay-primary px-4 py-2 text-xs font-bold text-white rounded-xl cursor-pointer disabled:opacity-40 w-full sm:w-auto"
                    >
                      {isSubmittingPhoto ? 'Saving...' : (lang === 'hi' ? 'जोड़ें' : 'Publish')}
                    </button>
                  </div>
                </div>
              )}

              {/* Discovered Wikimedia Archive Photos Section if available */}
              {archivePhotos.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'hi' ? 'विकिमीडिया ऐतिहासिक पुरालेख तस्वीरें' : 'Discovered Wikimedia Archive Photos'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {archivePhotos.length} {lang === 'hi' ? 'तस्वीरें उपलब्ध' : 'photos found'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {archivePhotos.map((url, i) => (
                      <div
                        key={i}
                        className="relative aspect-4/3 rounded-xl overflow-hidden border border-white/10 bg-black/60 group cursor-pointer"
                        onClick={() => setLightboxPhoto({ url, caption: `${item.title} Wikimedia Historical Archive` })}
                      >
                        <img
                          src={url}
                          alt={`${item.title} archive ${i + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handleAddCrowdPhoto(url, `${item.title} Historical Archive`, 'Wikimedia Commons');
                            setArchivePhotos((prev) => {
                              const updated = prev.filter((_, idx) => idx !== i);
                              if (item?.id) MONUMENT_ARCHIVE_PHOTOS_CACHE.set(item.id, updated);
                              return updated;
                            });
                          }}
                          className="absolute bottom-1.5 right-1.5 btn-glass-clay btn-glass-clay-primary px-2 py-1 text-[10px] text-white rounded-lg cursor-pointer shadow-md opacity-90 hover:opacity-100"
                          title="Save this photo to the monument gallery"
                        >
                          + {lang === 'hi' ? 'गैलरी में रखें' : 'Save'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Combined Gallery Grid */}
              {customGallery.length === 0 && crowdPhotos.length === 0 && archivePhotos.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10">
                  <ImageIcon className="w-10 h-10 text-zinc-500 mx-auto mb-3 opacity-60" />
                  <p className="text-sm font-medium text-zinc-300">
                    {lang === 'hi' ? 'गैलरी में कोई फोटो नहीं है' : 'No photos in gallery'}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    {lang === 'hi'
                      ? 'ऊपर दिए गए "फोटो जोड़ें" बटन से तुरंत अपने फोन से तस्वीर अपलोड करें या "पुरालेख फोटो खोजें" दबाएं।'
                      : 'Upload directly from your phone camera or click "Discover Archive Photos" above.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* 1. Crowdsourced Contributed Photos */}
                  {crowdPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-4/3 rounded-xl overflow-hidden border border-amber-500/30 bg-[#1C1917] group cursor-pointer shadow-md"
                      onClick={() =>
                        setLightboxPhoto({
                          url: photo.image_url,
                          caption: photo.caption,
                          contributor: photo.contributor_name,
                          photoId: photo.id,
                        })
                      }
                    >
                      <LazyHeritageImage
                        src={photo.image_url}
                        alt={`${item.title} contributed by ${photo.contributor_name}`}
                        itemId={item.id}
                        categoryId={item.category_id}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/75 backdrop-blur-md text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          <span>{photo.contributor_name}</span>
                        </span>
                      </div>

                      {/* Always accessible Delete Button on Mobile, Hover on Desktop */}
                      <div className="absolute top-2 right-2 z-20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(photo.id);
                          }}
                          className="btn-glass-clay btn-glass-clay-danger p-1.5 sm:p-2 rounded-xl text-white shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:opacity-100 cursor-pointer flex items-center gap-1"
                          title={lang === 'hi' ? 'फोटो हटाएं' : 'Delete photo'}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-200" />
                          <span className="text-[10px] sm:hidden font-medium">{lang === 'hi' ? 'हटाएं' : 'Delete'}</span>
                        </button>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                        <div className="text-left text-white min-w-0 pr-2">
                          {photo.caption && <p className="text-xs font-semibold truncate">{photo.caption}</p>}
                          <p className="text-[10px] text-zinc-300">{new Date(photo.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 2. Curated & Historical Photos */}
                  {customGallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-4/3 rounded-xl overflow-hidden border border-white/10 bg-[#1C1917] group cursor-pointer"
                      onClick={() =>
                        setLightboxPhoto({
                          url: imgUrl,
                          caption: `${item.title} Historical Archive`,
                          isCustomIndex: idx,
                        })
                      }
                    >
                      <LazyHeritageImage
                        src={imgUrl}
                        alt={`${item.title} gallery ${idx + 1}`}
                        itemId={item.id}
                        categoryId={item.category_id}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Always accessible Delete Button on Mobile, Hover on Desktop */}
                      <div className="absolute top-2 right-2 z-20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomGallery((prev) => {
                              const updated = prev.filter((_, i) => i !== idx);
                              MEMORY_GALLERY_CACHE[item.id] = updated;
                              item.gallery = updated;
                              try {
                                localStorage.setItem(`gallery_${item.id}`, JSON.stringify(updated));
                              } catch { /* ignore */ }
                              return updated;
                            });
                            onShowToast(lang === 'hi' ? 'फोटो हटा दी गई' : 'Photo removed', 'info');
                          }}
                          className="btn-glass-clay btn-glass-clay-danger p-1.5 sm:p-2 rounded-xl text-white shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:opacity-100 cursor-pointer flex items-center gap-1"
                          title={lang === 'hi' ? 'फोटो हटाएं' : 'Remove photo'}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-200" />
                          <span className="text-[10px] sm:hidden font-medium">{lang === 'hi' ? 'हटाएं' : 'Delete'}</span>
                        </button>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                        <span className="text-xs font-medium text-white">
                          {lang === 'hi' ? `चित्र ${idx + 1}` : `Photo ${idx + 1}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fullscreen Photo Lightbox Preview (Mobile-Safe with Delete Action) */}
              {lightboxPhoto && (
                <div
                  className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
                  onClick={() => setLightboxPhoto(null)}
                >
                  <div
                    className="relative w-full max-w-3xl max-h-[86vh] bg-[#0c1015] rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col mx-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Top Lightbox Actions */}
                    <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                      {(lightboxPhoto.photoId || typeof lightboxPhoto.isCustomIndex === 'number') && (
                        <button
                          type="button"
                          onClick={() => {
                            if (lightboxPhoto.photoId) {
                              handleDeletePhoto(lightboxPhoto.photoId);
                            } else if (typeof lightboxPhoto.isCustomIndex === 'number') {
                              const idx = lightboxPhoto.isCustomIndex;
                              setCustomGallery((prev) => {
                                const updated = prev.filter((_, i) => i !== idx);
                                MEMORY_GALLERY_CACHE[item.id] = updated;
                                item.gallery = updated;
                                try {
                                  localStorage.setItem(`gallery_${item.id}`, JSON.stringify(updated));
                                } catch {}
                                return updated;
                              });
                              setLightboxPhoto(null);
                              onShowToast(lang === 'hi' ? 'फोटो हटा दी गई।' : 'Photo removed from gallery.', 'info');
                            }
                          }}
                          className="btn-glass-clay btn-glass-clay-danger px-3 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg cursor-pointer"
                          title={lang === 'hi' ? 'इस फोटो को हटाएं' : 'Delete this photo'}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-200" />
                          <span>{lang === 'hi' ? 'फोटो हटाएं' : 'Delete Photo'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setLightboxPhoto(null)}
                        className="btn-glass-clay btn-glass-clay-icon w-8 h-8 rounded-full text-white cursor-pointer bg-black/80 hover:bg-black"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4 bg-black/50 overflow-hidden">
                      <img
                        src={lightboxPhoto.url}
                        alt={lightboxPhoto.caption || item.title}
                        className="max-h-[60vh] sm:max-h-[70vh] max-w-full w-auto object-contain rounded-lg"
                      />
                    </div>
                    {(lightboxPhoto.caption || lightboxPhoto.contributor) && (
                      <div className="p-3 sm:p-3.5 bg-black/90 border-t border-white/10 text-left shrink-0">
                        {lightboxPhoto.caption && <p className="text-xs font-semibold text-white truncate sm:text-clip">{lightboxPhoto.caption}</p>}
                        {lightboxPhoto.contributor && (
                          <p className="text-[11px] text-amber-400 mt-0.5">
                            {lang === 'hi' ? `योगदानकर्ता: ${lightboxPhoto.contributor}` : `Contributed by: ${lightboxPhoto.contributor}`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            )
          )}

          {/* "Discover More" Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="pt-6 border-t border-white/10">
              <span className="font-serif font-bold text-sm text-white block mb-3">
                {lang === 'hi' ? 'अन्य संबंधित स्मारक देखें' : 'Discover More Related Monuments'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendations.map((rec, idx) => (
                  <div
                    key={`${rec.id}-${idx}`}
                    onClick={() => {
                      if (onSelectRecommendedItem) {
                        onSelectRecommendedItem(rec);
                      }
                    }}
                    className="p-3 bg-white/[0.02] rounded-xl border border-white/10 hover:border-[#e0231c] transition-all cursor-pointer group card-slide-item card-interactive-slide"
                    style={{ '--stagger-index': idx } as React.CSSProperties}
                  >
                    <div className="h-20 w-full rounded-md overflow-hidden mb-2 bg-[#05070a]">
                      <LazyHeritageImage
                        src={rec.image_url}
                        alt={rec.title}
                        itemId={rec.id}
                        categoryId={rec.category_id}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="font-serif font-bold text-xs text-white block truncate group-hover:text-[#ff5a3c]">
                      {lang === 'hi' && rec.hindi_title ? rec.hindi_title : rec.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate block">
                      {rec.location_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 border-t border-white/10 bg-[#05070a] flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-zinc-400 tabular-nums text-[10.5px] sm:text-xs truncate">
              {item.lat.toFixed(2)}° N, {item.lng.toFixed(2)}° E
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass-clay btn-glass-clay-secondary flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold cursor-pointer shrink-0"
            >
              <Navigation className="w-3.5 h-3.5 text-[#ff5a3c]" />
              <span>Maps</span>
              <ExternalLink className="w-3 h-3 text-zinc-400 hidden xs:inline" />
            </a>

            <button
              onClick={() => onToggleSave(item.id)}
              className="btn-glass-clay btn-glass-clay-primary flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold cursor-pointer shrink-0"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? t.saved_item : t.save_item}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Academic Heritage Dossier Modal */}
      <ErrorBoundary fallbackTitle="Academic Dossier Viewer">
        <HeritageDossierModal
          isOpen={showDossierModal}
          onClose={() => setShowDossierModal(false)}
          item={item}
          lang={lang}
        />
      </ErrorBoundary>
    </div>
  );
};
