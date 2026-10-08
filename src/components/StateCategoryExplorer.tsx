import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Landmark,
  Sparkles,
  Utensils,
  Languages,
  Palette,
  Heart,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Volume2,
  Bookmark,
  PlusCircle,
  Eye,
  Check,
  X,
  Award,
  MapPin,
  Building2,
  Crown,
  Layers,
  ShieldCheck,
  UtensilsCrossed,
  PartyPopper
} from 'lucide-react';
import { State, HeritageItem, Food, Festival, Language, Tradition, Craft } from '../types.ts';
import { LanguageKey, t } from '../i18n.ts';
import { FOODS, FESTIVALS, LANGUAGES, TRADITIONS, CRAFTS, HERITAGE_ITEMS } from '../data/seedDatabase.ts';
import { sortMonumentsByPopularity } from '../data/monumentPopularity.ts';
import { getHeritageImageUrl, handleHeritageImageError } from '../utils/imageHelper.ts';
import { LazyHeritageImage } from './LazyHeritageImage.tsx';
import { StateCategoryExplorerSkeleton } from './SkeletonLoaders.tsx';
import {
  getStateName,
  getStateOverview,
  getStateCulture,
  getStateFestivals,
  getStateFood,
  getStateLanguages,
  getStateArtCrafts,
  getFestivalName,
  getFestivalSignificance,
  getFestivalCelebration,
  getFoodName,
  getFoodDescription,
  getHeritageTitle,
  getHeritageSummary,
  getRegionName,
  getUIText
} from '../data/hindiDescriptions.ts';

export type ThingToSeeCategory =
  | 'monuments'
  | 'festivals'
  | 'traditions'
  | 'arts'
  | 'languages'
  | 'food';

// Hoisted static constants (allocated once in module scope, never recreated on re-renders)
const REGION_NAMES_HI: Record<string, string> = {
  all: 'सभी क्षेत्र (36)',
  North: 'उत्तर',
  South: 'दक्षिण',
  West: 'पश्चिम',
  East: 'पूर्व',
  Central: 'मध्य',
  Northeast: 'पूर्वोत्तर',
  Islands: 'द्वीप समूह',
};

const REGION_BUTTONS = ['all', 'North', 'South', 'West', 'East', 'Central', 'Northeast', 'Islands'] as const;

// Module-level precomputed state records map (computed once at app start to avoid repeated iteration loops)
const STATIC_STATE_COUNTS_MAP = (() => {
  const map = new Map<string, number>();
  for (const item of HERITAGE_ITEMS) {
    map.set(item.state_id, (map.get(item.state_id) || 0) + 1);
  }
  for (const fest of FESTIVALS) {
    map.set(fest.state_id, (map.get(fest.state_id) || 0) + 1);
  }
  for (const food of FOODS) {
    map.set(food.state_id, (map.get(food.state_id) || 0) + 1);
  }
  for (const lang of LANGUAGES) {
    map.set(lang.state_id, (map.get(lang.state_id) || 0) + 1);
  }
  for (const trad of TRADITIONS) {
    map.set(trad.state_id, (map.get(trad.state_id) || 0) + 1);
  }
  for (const craft of CRAFTS) {
    map.set(craft.state_id, (map.get(craft.state_id) || 0) + 1);
  }
  return map;
})();

const CATEGORY_TABS: Array<{
  id: ThingToSeeCategory;
  name: string;
  hindi_name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  hindi_description: string;
}> = [
  {
    id: 'monuments',
    name: 'Monuments & Sites',
    hindi_name: 'स्मारक एवं स्थापत्य',
    icon: Landmark,
    description: 'Ancient monolithic temples, hilltop forts, royal palaces, and UNESCO heritage.',
    hindi_description: 'प्राचीन शैलकृत मंदिर, गिरि दुर्ग, राजमहल एवं यूनेस्को विश्व धरोहर।',
  },
  {
    id: 'festivals',
    name: 'Festivals & Fairs',
    hindi_name: 'त्योहार एवं उत्सव',
    icon: Sparkles,
    description: 'Sacred processions, seasonal harvest celebrations, and temple melas.',
    hindi_description: 'पवित्र शोभायात्राएं, ऋतु उत्सव, फसल पर्व एवं पारंपरिक मेले।',
  },
  {
    id: 'traditions',
    name: 'Traditions & Lore',
    hindi_name: 'परंपराएं एवं लोक संस्कृति',
    icon: Heart,
    description: 'Classical dance forms, community folk arts, folklore, and tribal customs.',
    hindi_description: 'शास्त्रीय नृत्य शैलियां, लोक गाथाएं, समुदाय परंपराएं एवं जनजातीय रीति।',
  },
  {
    id: 'arts',
    name: 'Art, Crafts & Textiles',
    hindi_name: 'कला, शिल्प एवं वस्त्र',
    icon: Palette,
    description: 'GI-tagged handicrafts, intricate needlework, handlooms, and bronze casting.',
    hindi_description: 'भौगोलिक संकेत (GI) शिल्प, पारंपरिक हथकरघा, चित्रकला एवं धातु कला।',
  },
  {
    id: 'languages',
    name: 'Languages & Scripts',
    hindi_name: 'भाषाएं एवं लिपियां',
    icon: Languages,
    description: 'Classical tongues, sacred epigraphy, ancient scripts, and greetings.',
    hindi_description: 'शास्त्रीय भाषाएं, प्राचीन शिलालेख, मातृभाषाएं एवं सांस्कृतिक अभिवादन।',
  },
  {
    id: 'food',
    name: 'Regional Food',
    hindi_name: 'पारंपरिक व्यंजन',
    icon: Utensils,
    description: 'Heritage recipes, regional thalis, Ayurvedic spices, and temple offerings.',
    hindi_description: 'पारंपरिक क्षेत्रीय थाली, आयुर्वेदिक मसाले, पकवान एवं भोग प्रसाद।',
  },
];

const EPOCH_OPTIONS = [
  { id: 'all' as const, label: 'All Eras', hindi_label: 'समग्र', epoch: 'All India' },
  { id: 'Ancient' as const, label: 'Ancient', hindi_label: 'प्राचीन', epoch: 'Pre-700' },
  { id: 'Medieval' as const, label: 'Medieval', hindi_label: 'मध्यकालीन', epoch: '700-1500' },
  { id: 'Mughal' as const, label: 'Mughal/Rajput', hindi_label: 'मुगल/राजपूत', epoch: '1500-1750' },
  { id: 'Colonial' as const, label: 'Colonial/Modern', hindi_label: 'आधुनिक', epoch: '1800+' },
] as const;

function getCategoryLabel(id: ThingToSeeCategory, lang: LanguageKey): { name: string; desc: string } {
  switch (id) {
    case 'monuments':
      return {
        name: lang === 'en' ? 'Monuments & Sites' : lang === 'hi' ? 'स्मारक एवं स्थापत्य' : lang === 'bn' ? 'স্মৃতিস্তম্ভ ও স্থাপত্য' : lang === 'ta' ? 'நினைவுச்சின்னங்கள்' : lang === 'te' ? 'స్మారకాలు & వాస్తుశిల్పం' : lang === 'mr' ? 'स्मारके आणि वास्तुकला' : lang === 'gu' ? 'સ્મારકો અને સ્થાપત્ય' : 'ಸ್ಮಾರಕಗಳು ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪ',
        desc: lang === 'en' ? 'Ancient temples, forts, palaces, and UNESCO heritage.' : lang === 'hi' ? 'प्राचीन शैलकृत मंदिर, गिरि दुर्ग, राजमहल एवं यूनेस्को विश्व धरोहर।' : lang === 'bn' ? 'প্রাচীন মন্দির, পাহাড়ি দুর্গ ও ইউনেস্কো ঐতিহ্য।' : lang === 'ta' ? 'பண்டைய கோயில்கள், மலைக்கோட்டைகள் மற்றும் பாரம்பரியம்.' : lang === 'te' ? 'ప్రాచీన దేవాలయాలు, కోటలు మరియు వారసత్వం.' : lang === 'mr' ? 'प्राचीन मंदिरे, किल्ले आणि जागतिक वारसा.' : lang === 'gu' ? 'પ્રાચીન મંદિરો, પહાડી કિલ્લાઓ અને વારસો.' : 'ಪ್ರಾಚೀನ ದೇವಾಲಯಗಳು, ಕೋಟೆಗಳು ಮತ್ತು ಪರಂಪರೆ.'
      };
    case 'festivals':
      return {
        name: lang === 'en' ? 'Festivals & Fairs' : lang === 'hi' ? 'त्योहार एवं उत्सव' : lang === 'bn' ? 'উৎসব ও মেলা' : lang === 'ta' ? 'திருவிழாக்கள் & மேளாக்கள்' : lang === 'te' ? 'పండుగలు & జాతరలు' : lang === 'mr' ? 'सण आणि जत्रा' : lang === 'gu' ? 'તહેવારો અને મેળાઓ' : 'ಹಬ್ಬಗಳು ಮತ್ತು ಜಾತ್ರೆಗಳು',
        desc: lang === 'en' ? 'Sacred processions, seasonal harvest celebrations, and temple melas.' : lang === 'hi' ? 'पवित्र शोभायात्राएं, ऋतु उत्सव, फसल पर्व एवं पारंपरिक मेले।' : lang === 'bn' ? 'পবিত্র শোভাযাত্রা, ঋতু ও ফসল উৎসব এবং মেলা।' : lang === 'ta' ? 'புனித ஊர்வலங்கள் மற்றும் கோயில் திருவிழாக்கள்.' : lang === 'te' ? 'పవిత్ర ఊరేగింపులు మరియు పండుగలు.' : lang === 'mr' ? 'पवित्र मिरवणुका आणि पारंपरिक जत्रा.' : lang === 'gu' ? 'પવિત્ર શોભાયાત્રાઓ અને મેળાઓ.' : 'ಪವಿತ್ರ ಮೆರವಣಿಗೆಗಳು ಮತ್ತು ಜಾತ್ರೆಗಳು.'
      };
    case 'traditions':
      return {
        name: lang === 'en' ? 'Traditions & Lore' : lang === 'hi' ? 'परंपराएं एवं लोक संस्कृति' : lang === 'bn' ? 'ঐতিহ্য ও লোকসংস্কৃতি' : lang === 'ta' ? 'பாரம்பரியம் & நாட்டுப்புறக் கலை' : lang === 'te' ? 'సంప్రదాయాలు & జానపదం' : lang === 'mr' ? 'परंपरा आणि लोकसंस्कृती' : lang === 'gu' ? 'પરંપરાઓ અને લોકસંસ્કૃતિ' : 'ಸಂಪ್ರದಾಯಗಳು ಮತ್ತು ಜಾನಪದ',
        desc: lang === 'en' ? 'Classical dance forms, folklore, community arts, and tribal customs.' : lang === 'hi' ? 'शास्त्रीय नृत्य शैलियां, लोक गाथाएं, समुदाय परंपराएं एवं जनजातीय रीति।' : lang === 'bn' ? 'শাস্ত্রীয় নৃত্যকলা, লোকগাথা ও প্রথা।' : lang === 'ta' ? 'செவ்வியல் நடனங்கள் மற்றும் நாட்டுப்புறக் கலைகள்.' : lang === 'te' ? 'శాస్త్రీయ నృತ್ಯాలు మరియు జానపద కళలు.' : lang === 'mr' ? 'शास्त्रीय नृत्ये आणि लोकसंस्कृती.' : lang === 'gu' ? 'શાસ્ત્રીય નૃત્ય અને લોકકથાઓ.' : 'ಶಾಸ್ತ್ರೀಯ ನೃತ್ಯ ಮತ್ತು ಜಾನಪದ ಕಲೆಗಳು.'
      };
    case 'arts':
      return {
        name: lang === 'en' ? 'Art, Crafts & Textiles' : lang === 'hi' ? 'कला, शिल्प एवं वस्त्र' : lang === 'bn' ? 'শিল্প, কারুশিল্প ও তাঁত' : lang === 'ta' ? 'கலை, கைவினை & கைத்தறி' : lang === 'te' ? 'కళలు, హస్తకళలు & చేనేత' : lang === 'mr' ? 'कला, हस्तकला आणि कापड' : lang === 'gu' ? 'કળા, હસ્તકલા અને કાપડ' : 'ಕಲೆ, ಕರಕುಶಲತೆ ಮತ್ತು ಕೈಮಗ್ಗ',
        desc: lang === 'en' ? 'GI-tagged handicrafts, intricate needlework, handlooms, and bronze casting.' : lang === 'hi' ? 'भौगोलिक संकेत (GI) शिल्प, पारंपरिक हथकरघा, चित्रकला एवं धातु कला।' : lang === 'bn' ? 'জিআই স্বীকৃত কারুশিল্প, তাঁতবস্ত্র ও ব্রোঞ্জ ঢালাই।' : lang === 'ta' ? 'ஜிஐ பெற்ற கைவினைப்பொருட்கள் மற்றும் கைத்தறி.' : lang === 'te' ? 'జిఐ గుర్తింపు పొందిన హస్తకళలు మరియు చేనేత.' : lang === 'mr' ? 'जीआय प्राप्त हस्तकला आणि पारंपारिक हातमाग.' : lang === 'gu' ? 'જીઆઈ માન્યતા પ્રાપ્ત હસ્તકલા અને કાપડ.' : 'ಕರಕುಶಲ ವಸ್ತುಗಳು ಮತ್ತು ಕೈಮಗ್ಗ ನೇಯ್ಗೆ.'
      };
    case 'languages':
      return {
        name: lang === 'en' ? 'Languages & Scripts' : lang === 'hi' ? 'भाषाएं एवं लिपियां' : lang === 'bn' ? 'ভাষা ও প্রাচীন লিপি' : lang === 'ta' ? 'மொழிகள் & எழுத்துக்கள்' : lang === 'te' ? 'భాషలు & ప్రాచీన లిపులు' : lang === 'mr' ? 'भाषा आणि प्राचीन लिपी' : lang === 'gu' ? 'ભાષાઓ અને પ્રાચીન લિપિઓ' : 'ಭಾಷೆಗಳು ಮತ್ತು ಪ್ರಾಚೀನ ಲಿಪಿಗಳು',
        desc: lang === 'en' ? 'Classical tongues, sacred epigraphy, ancient scripts, and greetings.' : lang === 'hi' ? 'शास्त्रीय भाषाएं, प्राचीन शिलालेख, मातृभाषाएं एवं सांस्कृतिक अभिवादन।' : lang === 'bn' ? 'শাস্ত্রীয় ভাষা, প্রাচীন শিলালিপি ও অভিবাদন।' : lang === 'ta' ? 'செம்மொழிகள், கல்வெட்டுகள் மற்றும் வாழ்த்துகள்.' : lang === 'te' ? 'శాస్త్రీయ భాషలు, శాసనాలు మరియు శుభాకాంక్షలు.' : lang === 'mr' ? 'अभिजात भाषा, शिलालेख आणि पारंपारिक अभिवादन.' : lang === 'gu' ? 'શાસ્ત્રીય ભાષાઓ, શિલાલેખો અને અભિવાદન.' : 'ಶಾಸ್ತ್ರೀಯ ಭಾಷೆಗಳು, ಶಾಸನಗಳು ಮತ್ತು ವಂದನೆಗಳು.'
      };
    case 'food':
      return {
        name: lang === 'en' ? 'Regional Cuisine' : lang === 'hi' ? 'पारंपरिक व्यंजन' : lang === 'bn' ? 'ঐতিহ্যবাহী রান্না' : lang === 'ta' ? 'பாரம்பரிய உணவு' : lang === 'te' ? 'సాంప్రదాయ వంటకాలు' : lang === 'mr' ? 'पारंपारिक खाद्यसंस्कृती' : lang === 'gu' ? 'પરંપરાગત વાનગીઓ' : 'ಸಾಂಪ್ರದಾಯಿಕ ಆಹಾರ',
        desc: lang === 'en' ? 'Heritage recipes, regional thalis, Ayurvedic spices, and temple offerings.' : lang === 'hi' ? 'पारंपरिक क्षेत्रीय थाली, आयुर्वेदिक मसाले, पकवान एवं भोग प्रसाद।' : lang === 'bn' ? 'আঞ্চলিক থালি, ঔষধি মশলা এবং ঐতিহ্যবাহী মিষ্টি।' : lang === 'ta' ? 'பாரம்பரிய சுவைகள் மற்றும் திருவிழா சிறப்பு உணவுகள்.' : lang === 'te' ? 'ప్రాంతీయ రుచులు మరియు పండుಗ వంటకాలు.' : lang === 'mr' ? 'प्रादेशिक थाळी आणि सणांचे गोडधोड पदार्थ.' : lang === 'gu' ? 'પ્રાદેશિક થાળી અને સ્વાદિષ્ટ વાનગીઓ.' : 'ಪ್ರಾದೇಶಿಕ ಆಹಾರ ಮತ್ತು ಹಬ್ಬದ ತಿನಿಸುಗಳು.'
      };
  }
}

function getEpochName(id: string, lang: LanguageKey, defaultLabel: string): string {
  switch (id) {
    case 'all':
      return lang === 'en' ? 'All Eras' : lang === 'hi' ? 'समग्र कालखंड' : lang === 'bn' ? 'সকল যুগ' : lang === 'ta' ? 'அனைத்து காலங்கள்' : lang === 'te' ? 'అన్ని యుగాలు' : lang === 'mr' ? 'सर्व काळ' : lang === 'gu' ? 'બધા યુગ' : 'ಎಲ್ಲಾ ಕಾಲ';
    case 'Ancient':
      return lang === 'en' ? 'Ancient' : lang === 'hi' ? 'प्राचीन' : lang === 'bn' ? 'প্রাচীন' : lang === 'ta' ? 'பண்டைய' : lang === 'te' ? 'ప్రాచీన' : lang === 'mr' ? 'प्राचीन' : lang === 'gu' ? 'પ્રાચીન' : 'ಪ್ರಾಚೀನ';
    case 'Medieval':
      return lang === 'en' ? 'Medieval' : lang === 'hi' ? 'मध्यकालीन' : lang === 'bn' ? 'মধ্যযুগীয়' : lang === 'ta' ? 'மத்தியகால' : lang === 'te' ? 'మధ్యయుగం' : lang === 'mr' ? 'मध्ययुगीन' : lang === 'gu' ? 'મધ્યકાલીન' : 'ಮಧ್ಯಕಾಲೀನ';
    case 'Mughal':
      return lang === 'en' ? 'Mughal / Rajput' : lang === 'hi' ? 'मुगल / राजपूत' : lang === 'bn' ? 'মুঘল / রাজপুত' : lang === 'ta' ? 'முகலாய / ராஜபுத்திர' : lang === 'te' ? 'మొఘల్ / రాజపుత్ర' : lang === 'mr' ? 'मुघल / राजपूत' : lang === 'gu' ? 'મુઘલ / રાજપૂત' : 'ಮೊಘಲ್ / ರಜಪೂತ';
    case 'Colonial':
      return lang === 'en' ? 'Colonial / Modern' : lang === 'hi' ? 'आधुनिक' : lang === 'bn' ? 'ঔপনিবেশিক / আধুনিক' : lang === 'ta' ? 'நவீன' : lang === 'te' ? 'ఆధునిక' : lang === 'mr' ? 'आधुनिक' : lang === 'gu' ? 'આધુનિક' : 'ಆಧುನಿಕ';
    default:
      return defaultLabel;
  }
}

// 1. Memoized Monument Card with rich, structured metadata and scannable highlights
interface MonumentCardProps {
  item: HeritageItem;
  isSaved: boolean;
  lang: LanguageKey;
  onSelectItem: (item: HeritageItem) => void;
  onToggleSave: (id: string, e?: React.MouseEvent) => void;
  staggerIndex?: number;
}

const MonumentCard = React.memo<MonumentCardProps>(({
  item,
  isSaved,
  lang,
  onSelectItem,
  onToggleSave,
  staggerIndex = 0,
}) => {
  // Derive architectural style based on epoch and category
  const architecturalStyle = useMemo(() => {
    if (item.category_id === 'temples') {
      return item.period === 'Ancient' ? 'Monolithic Rock-Cut & Nagara/Dravidian Shikhara' : 'Carved Sandstone Mandapa & Gopuram';
    }
    if (item.category_id === 'forts') {
      return 'Fortified Bastions, Battlements & Rajput-Mughal Jharokhas';
    }
    return 'Classical Indian Masonry with Precision Interlocking Stonework';
  }, [item.category_id, item.period]);

  return (
    <article
      onClick={() => onSelectItem(item)}
      className="group bg-white dark:bg-[#0a0e12]/95 rounded-2xl border border-stone-200/90 dark:border-white/10 overflow-hidden hover:border-[#e0231c]/50 transition-all cursor-pointer flex flex-col justify-between text-left shadow-xs card-slide-item card-interactive-slide"
      style={{ '--stagger-index': Math.min(staggerIndex, 18) } as React.CSSProperties}
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-48 sm:h-54 w-full overflow-hidden bg-stone-100 dark:bg-[#05070a]">
          <LazyHeritageImage
            src={item.image_url}
            alt={item.title}
            itemId={item.id}
            categoryId={item.category_id}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:-translate-y-0.5 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Top Floating Control Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {item.is_community ? (
              <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300/40 shadow-md flex items-center gap-1.5">
                <Landmark className="w-3 h-3 text-white shrink-0" />
                <span>{lang === 'hi' ? 'जन योगदान' : 'Community'}</span>
              </span>
            ) : item.unesco_flag ? (
              <span className="bg-amber-500/90 backdrop-blur-md text-stone-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300 shadow-md flex items-center gap-1.5">
                <Award className="w-3 h-3 text-stone-950 shrink-0" />
                <span>UNESCO</span>
              </span>
            ) : null}
            <span className="bg-black/75 backdrop-blur-md text-stone-200 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border border-white/15">
              {item.period} Era
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={(e) => onToggleSave(item.id, e)}
              className={`btn-glass-clay btn-glass-clay-icon p-2 rounded-full cursor-pointer transition-transform active:scale-90 ${
                isSaved
                  ? 'btn-glass-clay-primary text-white shadow-md'
                  : 'bg-black/60 text-white hover:bg-[#e0231c]'
              }`}
              title={isSaved ? (getUIText('saved_item', lang) || 'Saved') : (getUIText('save_item', lang) || 'Bookmark item')}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-amber-400' : ''}`} />
            </button>
          </div>

          {/* Bottom Overlay Location Tag */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white/95 text-xs z-10">
            <div className="flex items-center gap-1.5 truncate text-[11px] font-medium drop-shadow-md">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{item.location_name}</span>
            </div>
            <code className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/75 text-amber-300 border border-amber-500/30 shrink-0 font-bold">
              {`ASI-${item.state_id.toUpperCase().slice(0, 3)}-${item.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || '0042'}`}
            </code>
          </div>
        </div>

        {/* Content Body with Structured Highlights */}
        <div className="p-4 space-y-3">
          <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white group-hover:text-[#e0231c] dark:group-hover:text-[#ff5a3c] transition-colors leading-snug">
            {getHeritageTitle(item, lang)}
          </h4>

          {/* Curatorial Summary */}
          <p className="text-xs text-stone-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
            {getHeritageSummary(item, lang)}
          </p>

          {/* Structured Visual Data Blocks */}
          <div className="pt-2 border-t border-stone-100 dark:border-white/10 space-y-2 text-xs">
            {/* Architectural Marvel & Engineering Line */}
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200 dark:border-white/10 flex items-start gap-2">
              <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="font-bold text-stone-800 dark:text-zinc-200 block text-[10px] uppercase tracking-wider">
                  {lang === 'hi' ? 'स्थापत्य शैली एवं संरचना' : 'Architectural Marvel & Style'}
                </span>
                <span className="text-[11px] text-stone-600 dark:text-zinc-400 block line-clamp-1 font-medium">
                  {architecturalStyle}
                </span>
              </div>
            </div>

            {/* Timings and Best Visiting Season Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-amber-500/5 dark:bg-white/[0.02] border border-amber-500/20 text-stone-700 dark:text-zinc-300">
                <span className="font-bold text-amber-700 dark:text-amber-400 block text-[10px] uppercase tracking-wider">
                  {lang === 'hi' ? 'दर्शन समय' : 'Visiting Hours'}
                </span>
                <span className="truncate block font-medium mt-0.5">
                  {item.timings || '08:00 AM - 06:00 PM'}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-emerald-500/5 dark:bg-white/[0.02] border border-emerald-500/20 text-stone-700 dark:text-zinc-300">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-[10px] uppercase tracking-wider">
                  {lang === 'hi' ? 'उत्कृष्ट मौसम' : 'Best Season'}
                </span>
                <span className="truncate block font-medium mt-0.5">
                  {item.best_time || 'October - March'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar with Action */}
      <div className="px-4 py-3 bg-stone-50 dark:bg-[#06090d] border-t border-stone-200 dark:border-white/[0.08] flex items-center justify-between text-xs text-stone-600 dark:text-zinc-400">
        <span className="font-medium flex items-center gap-1.5 text-stone-500 dark:text-zinc-400">
          <span className={`w-1.5 h-1.5 rounded-full ${item.is_community ? 'bg-blue-500' : 'bg-emerald-500'} animate-pulse`}></span>
          <span>{item.is_community ? (lang === 'hi' ? 'नागरिक योगदान प्रविष्टि' : 'Community Contribution') : (lang === 'hi' ? 'केंद्रीय संरक्षित स्मारक' : 'Centrally Protected ASI Site')}</span>
        </span>
        <span className="font-bold text-[#e0231c] dark:text-[#ff5a3c] group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1 shrink-0">
          <span>{getUIText('details', lang)}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </article>
  );
});
MonumentCard.displayName = 'MonumentCard';

// 2. Memoized State Card for smooth state strip navigation
interface StateCardProps {
  state: State;
  isSelected: boolean;
  itemCount: number;
  lang: LanguageKey;
  onSelect: (id: string) => void;
  staggerIndex?: number;
}

const StateCard = React.memo<StateCardProps>(({
  state: s,
  isSelected,
  itemCount,
  lang,
  onSelect,
  staggerIndex = 0,
}) => {
  return (
    <button
      onClick={() => onSelect(s.id)}
      className={`relative p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between overflow-hidden group card-horizontal-slide ${
        isSelected
          ? 'border-[#e0231c] bg-[#e0231c]/15 ring-2 ring-[#e0231c]/40 shadow-[0_6px_18px_rgba(224,35,28,0.25)] scale-[1.02]'
          : 'btn-glass-clay-secondary border-stone-300 dark:border-white/10 hover:border-[#e0231c]/50 hover:-translate-y-0.5'
      }`}
      style={{
        '--stagger-index': Math.min(staggerIndex, 24),
        boxShadow: isSelected
          ? '0 6px 18px -2px rgba(224, 35, 28, 0.3), inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.4), inset -2px -2px 3.5px rgba(0, 0, 0, 0.25)'
          : undefined
      } as React.CSSProperties}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-[#e0231c] dark:text-[#ff5a3c]">
            {getRegionName(s.region, lang)}
          </span>
          {isSelected && <Check className="w-3.5 h-3.5 text-[#e0231c] dark:text-[#ff5a3c]" />}
        </div>
        <span className="font-serif font-bold text-xs text-stone-900 dark:text-white block mt-1 truncate">
          {getStateName(s, lang)}
        </span>
        <span className="text-[10px] text-stone-500 dark:text-zinc-400 truncate block">
          {s.capital}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-stone-500 dark:text-zinc-400">
        <span className="font-mono tabular-nums text-amber-700 dark:text-[#c9a24a]">
          {itemCount} {getUIText('records_label', lang)}
        </span>
      </div>
    </button>
  );
});
StateCard.displayName = 'StateCard';

// 3. Memoized Festival Card with structured lore and celebration blocks
interface FestivalCardProps {
  fest: Festival;
  stateObj?: State;
  lang: LanguageKey;
  staggerIndex?: number;
}

const FestivalCard = React.memo<FestivalCardProps>(({ fest, stateObj: st, lang, staggerIndex = 0 }) => {
  return (
    <div
      className="bg-white dark:bg-[#1C1A17] rounded-2xl border border-[#E5DFD5] dark:border-[#2C2926] p-4 sm:p-5 shadow-xs hover:border-amber-500/40 transition-all flex flex-col justify-between card-slide-item card-interactive-slide"
      style={{ '--stagger-index': Math.min(staggerIndex, 18) } as React.CSSProperties}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8B2E24] dark:text-[#E8998D] font-semibold">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
            {st ? getStateName(st, lang) : getUIText('all_india_label', lang)}
          </span>
          <span className="flex items-center gap-1 text-stone-600 dark:text-zinc-400 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#8B2E24] dark:text-[#E8998D]" />
            <span>{fest.month_or_season}</span>
          </span>
        </div>

        <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white leading-snug">
          {getFestivalName(fest, lang)}
        </h4>

        {/* Structured Lore & Rituals */}
        <div className="space-y-2.5 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-white/[0.02] border border-amber-500/20">
            <span className="font-bold text-amber-800 dark:text-amber-400 block text-[11px] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{getUIText('significance_label', lang)}</span>
            </span>
            <p className="text-stone-700 dark:text-zinc-300 leading-relaxed font-normal">
              {getFestivalSignificance(fest, lang)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200 dark:border-white/10">
            <span className="font-bold text-stone-800 dark:text-zinc-200 block text-[11px] mb-1 flex items-center gap-1.5">
              <PartyPopper className="w-3.5 h-3.5 text-stone-600 dark:text-zinc-400 shrink-0" />
              <span>{getUIText('celebration_label', lang)}</span>
            </span>
            <p className="text-stone-600 dark:text-zinc-400 leading-relaxed font-normal">
              {getFestivalCelebration(fest, lang)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EFE8DD] dark:border-[#2A2724] flex items-center justify-between text-[11px] text-[#78716C] dark:text-[#A8A29E]">
        <span className="font-medium">{getUIText('festivals_heading', lang)}</span>
        <span className="font-bold text-[#8B2E24] dark:text-[#E8998D]">
          {getUIText('gi_cultural', lang)}
        </span>
      </div>
    </div>
  );
});
FestivalCard.displayName = 'FestivalCard';

// 4. Memoized Tradition Card (Classical Dances, Martial Arts & Folk Lore)
interface TraditionCardProps {
  tradition: Tradition;
  stateObj?: State;
  lang: LanguageKey;
  staggerIndex?: number;
}

const TraditionCard = React.memo<TraditionCardProps>(({ tradition, stateObj: st, lang, staggerIndex = 0 }) => {
  return (
    <div
      className="bg-white dark:bg-[#1C1A17] rounded-2xl border border-[#E5DFD5] dark:border-[#2C2926] p-4 sm:p-5 shadow-xs hover:border-red-500/40 transition-all flex flex-col justify-between card-slide-item card-interactive-slide"
      style={{ '--stagger-index': Math.min(staggerIndex, 18) } as React.CSSProperties}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
            {st ? getStateName(st, lang) : getUIText('all_india_label', lang)}
          </span>
          <span className="text-[10px] font-semibold text-stone-500 dark:text-zinc-400 bg-stone-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
            {tradition.type}
          </span>
        </div>

        <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white leading-snug">
          {lang === 'hi' && tradition.hindi_name ? tradition.hindi_name : tradition.name}
        </h4>

        <div className="space-y-2.5 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-red-500/5 dark:bg-white/[0.02] border border-red-500/20">
            <span className="font-bold text-red-800 dark:text-red-400 block text-[11px] mb-1 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
              <span>{lang === 'hi' ? 'उद्गम एवं परंपरा' : 'Origin & Lineage'} ({tradition.origin})</span>
            </span>
            <p className="text-stone-700 dark:text-zinc-300 leading-relaxed font-normal">
              {tradition.significance}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200 dark:border-white/10">
            <span className="font-bold text-stone-800 dark:text-zinc-200 block text-[11px] mb-1 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-stone-600 dark:text-zinc-400 shrink-0" />
              <span>{lang === 'hi' ? 'वेशभूषा, मुद्राएं एवं वाद्य' : 'Attire, Mudras & Instruments'}</span>
            </span>
            <p className="text-stone-600 dark:text-zinc-400 leading-relaxed font-normal">
              {tradition.performance_or_attire}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EFE8DD] dark:border-[#2A2724] flex items-center justify-between text-[11px] text-[#78716C] dark:text-[#A8A29E]">
        <span className="font-medium">{lang === 'hi' ? 'जीवंत लोक परंपरा' : 'Living Heritage Form'}</span>
        <span className="font-bold text-[#8B2E24] dark:text-[#E8998D]">
          {getUIText('gi_cultural', lang)}
        </span>
      </div>
    </div>
  );
});
TraditionCard.displayName = 'TraditionCard';

// 5. Memoized Craft Card (GI-Tagged Arts, Handlooms & Handicrafts)
interface CraftCardProps {
  craft: Craft;
  stateObj?: State;
  lang: LanguageKey;
  staggerIndex?: number;
}

const CraftCard = React.memo<CraftCardProps>(({ craft, stateObj: st, lang, staggerIndex = 0 }) => {
  return (
    <div
      className="bg-white dark:bg-[#1C1A17] rounded-2xl border border-[#E5DFD5] dark:border-[#2C2926] p-4 sm:p-5 shadow-xs hover:border-purple-500/40 transition-all flex flex-col justify-between card-slide-item card-interactive-slide"
      style={{ '--stagger-index': Math.min(staggerIndex, 18) } as React.CSSProperties}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider">
            {st ? getStateName(st, lang) : getUIText('all_india_label', lang)}
          </span>
          {craft.gi_tag && (
            <span className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-700 dark:text-amber-300 shrink-0" />
              <span>GI Tagged</span>
            </span>
          )}
        </div>

        <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white leading-snug">
          {lang === 'hi' && craft.hindi_name ? craft.hindi_name : craft.name}
        </h4>

        <div className="space-y-2.5 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-purple-500/5 dark:bg-white/[0.02] border border-purple-500/20">
            <span className="font-bold text-purple-800 dark:text-purple-400 block text-[11px] mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>{lang === 'hi' ? 'मूल सामग्री एवं उपकरण' : 'Raw Materials & Medium'}</span>
            </span>
            <p className="text-stone-700 dark:text-zinc-300 leading-relaxed font-normal">
              {craft.materials}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200 dark:border-white/10">
            <span className="font-bold text-stone-800 dark:text-zinc-200 block text-[11px] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-stone-600 dark:text-zinc-400 shrink-0" />
              <span>{lang === 'hi' ? 'पारंपरिक शिल्प तकनीक' : 'Ancestral Technique & Craft Lore'}</span>
            </span>
            <p className="text-stone-600 dark:text-zinc-400 leading-relaxed font-normal">
              {craft.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EFE8DD] dark:border-[#2A2724] flex items-center justify-between text-[11px] text-[#78716C] dark:text-[#A8A29E]">
        <span className="font-medium">{craft.craft_type}</span>
        <span className="font-bold text-purple-700 dark:text-purple-400">
          {lang === 'hi' ? 'प्रामाणिक भारतीय शिल्प' : 'Master Artisan Craft'}
        </span>
      </div>
    </div>
  );
});
CraftCard.displayName = 'CraftCard';

// 6. Memoized Language Card
interface LanguageCardProps {
  langItem: Language;
  stateObj?: State;
  isSpeaking: boolean;
  lang: LanguageKey;
  onSpeak: (text: string, id: string) => void;
  staggerIndex?: number;
}

const LanguageCard = React.memo<LanguageCardProps>(({
  langItem,
  stateObj: st,
  isSpeaking,
  lang,
  onSpeak,
  staggerIndex = 0,
}) => {
  return (
    <div
      className="bg-white dark:bg-[#1C1A17] rounded-2xl border border-[#E5DFD5] dark:border-[#2C2926] p-4 sm:p-5 shadow-xs hover:border-blue-500/40 transition-all flex flex-col justify-between card-slide-item card-interactive-slide"
      style={{ '--stagger-index': Math.min(staggerIndex, 18) } as React.CSSProperties}
    >
      <div>
        <div className="flex items-center justify-between text-xs text-[#8B2E24] dark:text-[#E8998D] font-semibold mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            {st ? getStateName(st, lang) : getUIText('all_india_label', lang)}
          </span>
          <span className="text-[#78716C] dark:text-[#A8A29E] font-mono text-[11px]">
            {getUIText('script_label', lang)} {langItem.script}
          </span>
        </div>

        <h4 className="font-serif font-bold text-lg sm:text-xl text-[#1C1917] dark:text-[#FAF8F5] mt-1.5">
          {langItem.name}
        </h4>

        <div className="mt-3 p-3 bg-[#FAF8F5] dark:bg-[#161514] rounded-xl border border-[#EFE8DD] dark:border-[#2A2724]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] block mb-1">
            {getUIText('greeting_label', lang)}
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-serif font-bold text-sm text-[#8B2E24] dark:text-[#E8998D]">
              {langItem.greeting}
            </span>
            <button
              onClick={() => onSpeak(langItem.greeting, langItem.id)}
              className={`btn-glass-clay btn-glass-clay-icon w-8 h-8 rounded-full cursor-pointer shrink-0 ${
                isSpeaking
                  ? 'btn-glass-clay-primary text-white animate-pulse'
                  : 'btn-glass-clay-secondary text-[#8B2E24] dark:text-[#E8998D]'
              }`}
              title={getUIText('listen_pronounce', lang)}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 text-xs text-[#78716C] dark:text-[#A8A29E]">
          <span>{getUIText('speaker_population', lang)}: </span>
          <span className="font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
            {langItem.speakers_count}
          </span>
        </div>
      </div>

      {st && (
        <p className="mt-3 pt-3 border-t border-[#EFE8DD] dark:border-[#2A2724] text-[11px] text-[#57534E] dark:text-[#C7C2BA] line-clamp-2">
          {getStateLanguages(st, lang)}
        </p>
      )}
    </div>
  );
});
LanguageCard.displayName = 'LanguageCard';

// 7. Memoized Food Card
interface FoodCardProps {
  food: Food;
  stateObj?: State;
  lang: LanguageKey;
  staggerIndex?: number;
}

const FoodCard = React.memo<FoodCardProps>(({ food, stateObj: st, lang, staggerIndex = 0 }) => {
  return (
    <div
      className="bg-white dark:bg-[#1C1A17] rounded-2xl border border-[#E5DFD5] dark:border-[#2C2926] overflow-hidden shadow-xs hover:border-amber-600/40 transition-all flex flex-col justify-between card-slide-item card-interactive-slide"
      style={{ '--stagger-index': Math.min(staggerIndex, 18) } as React.CSSProperties}
    >
      <div>
        <div className="h-28 sm:h-32 w-full bg-gradient-to-br from-[#F5EFE6] via-[#FAF8F5] to-[#EFE8DD] dark:from-[#25221F] dark:via-[#1E1C19] dark:to-[#181614] flex flex-col items-center justify-center p-4 border-b border-[#E5DFD5] dark:border-[#2C2926]">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-[#2A2622] shadow-xs flex items-center justify-center text-amber-700 dark:text-amber-400 border border-[#E5DDD0] dark:border-[#38332E]">
            <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-[11px] font-semibold text-[#8B2E24] dark:text-[#E8998D] mt-1.5 sm:mt-2">
            {st ? getStateName(st, lang) : getUIText('all_india_label', lang)} {getUIText('food_heading', lang)}
          </span>
        </div>

        <div className="p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#8B2E24] dark:text-[#E8998D]">
              {st ? getStateName(st, lang) : getUIText('all_india_label', lang)}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#EFE8DD] dark:bg-[#24211E] text-[#57534E] dark:text-[#D6D3D1]">
              {food.dietary_type === 'Vegetarian' ? getUIText('dietary_veg', lang) : getUIText('dietary_nonveg', lang)}
            </span>
          </div>

          <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1917] dark:text-[#FAF8F5]">
            {getFoodName(food, lang)}
          </h4>

          <p className="mt-1.5 text-xs text-[#57534E] dark:text-[#C7C2BA] leading-relaxed line-clamp-3">
            {getFoodDescription(food, lang)}
          </p>
        </div>
      </div>

      <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#FAF8F5] dark:bg-[#161514] border-t border-[#EFE8DD] dark:border-[#2A2724] text-[11px] text-[#78716C] dark:text-[#A8A29E] flex items-center justify-between">
        <span>{getUIText('recipe_label', lang)}</span>
        <span className="font-semibold text-[#8B2E24] dark:text-[#E8998D]">
          {getUIText('gi_cultural', lang)}
        </span>
      </div>
    </div>
  );
});
FoodCard.displayName = 'FoodCard';

// Main Props Interface
interface StateCategoryExplorerProps {
  lang: LanguageKey;
  states: State[];
  selectedStateId: string | null;
  onSelectState: (stateId: string | null) => void;
  heritageItems: HeritageItem[];
  onSelectItem: (item: HeritageItem) => void;
  onToggleSave: (id: string, e?: React.MouseEvent) => void;
  savedItemIds: Set<string>;
  onOpenAdmin?: () => void;
  onOpenContribute?: () => void;
  onOpenStatePanel?: (stateId: string) => void;
  activeCategory?: ThingToSeeCategory;
  onSelectCategory?: (category: ThingToSeeCategory) => void;
}

const StateCategoryExplorerComponent: React.FC<StateCategoryExplorerProps> = ({
  lang,
  states,
  selectedStateId,
  onSelectState,
  heritageItems,
  onSelectItem,
  onToggleSave,
  savedItemIds,
  onOpenAdmin,
  onOpenContribute,
  onOpenStatePanel,
  activeCategory: propActiveCategory,
  onSelectCategory: propOnSelectCategory,
}) => {
  // Active Category ("Thing to See")
  const [internalCategory, setInternalCategory] = useState<ThingToSeeCategory>('monuments');
  const activeCategory = propActiveCategory || internalCategory;

  const setActiveCategory = useCallback((cat: ThingToSeeCategory) => {
    setInternalCategory(cat);
    if (propOnSelectCategory) {
      propOnSelectCategory(cat);
    }
  }, [propOnSelectCategory]);

  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [epochFilter, setEpochFilter] = useState<'all' | 'Ancient' | 'Medieval' | 'Mughal' | 'Colonial' | 'Modern'>('all');
  const [stateSearch, setStateSearch] = useState<string>('');
  const [speakingLanguageId, setSpeakingLanguageId] = useState<string | null>(null);

  // Progressive rendering for mobile performance (renders initial 24 items, loads rest on-demand)
  const [visibleItemCount, setVisibleItemCount] = useState(24);

  useEffect(() => {
    setVisibleItemCount(24);
  }, [selectedStateId, epochFilter, regionFilter, activeCategory]);

  // Smooth skeleton transition state during filtering, epoch switching, or category change
  const [isFiltering, setIsFiltering] = useState(false);
  const prevFiltersRef = useRef({ selectedStateId, activeCategory, epochFilter, regionFilter });

  useEffect(() => {
    const prev = prevFiltersRef.current;
    if (
      prev.selectedStateId !== selectedStateId ||
      prev.activeCategory !== activeCategory ||
      prev.epochFilter !== epochFilter ||
      prev.regionFilter !== regionFilter
    ) {
      prevFiltersRef.current = { selectedStateId, activeCategory, epochFilter, regionFilter };
      setIsFiltering(true);
      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [selectedStateId, activeCategory, epochFilter, regionFilter]);

  // Fast O(1) state lookup map to eliminate repetitive O(N) .find() queries
  const statesMap = useMemo(() => {
    return new Map<string, State>(states.map((s) => [s.id, s]));
  }, [states]);

  // Filtered states by region and search
  const filteredStates = useMemo(() => {
    const cleanSearch = stateSearch.trim().toLowerCase();
    return states.filter((s) => {
      const matchRegion = regionFilter === 'all' || s.region.toLowerCase() === regionFilter.toLowerCase();
      if (!matchRegion) return false;
      if (!cleanSearch) return true;

      return (
        s.name.toLowerCase().includes(cleanSearch) ||
        (s.hindi_name && s.hindi_name.toLowerCase().includes(cleanSearch)) ||
        s.capital.toLowerCase().includes(cleanSearch)
      );
    });
  }, [states, regionFilter, stateSearch]);

  // Fast state item counts using precomputed module map
  const stateCountsMap = useMemo(() => {
    const map = new Map<string, number>(STATIC_STATE_COUNTS_MAP);
    if (heritageItems && heritageItems.length > 0) {
      for (const item of heritageItems) {
        if (item.is_community) {
          map.set(item.state_id, (map.get(item.state_id) || 0) + 1);
        }
      }
    }
    for (const s of states) {
      if (!map.has(s.id) || (map.get(s.id) || 0) < 1) {
        map.set(s.id, 1);
      }
    }
    return map;
  }, [heritageItems, states]);

  // Selected State Object (O(1) from statesMap)
  const currentState = useMemo(() => {
    return selectedStateId ? (statesMap.get(selectedStateId) || null) : null;
  }, [statesMap, selectedStateId]);

  // Filtered Items for the current State, Category, and Architectural Epoch
  const stateMonuments = useMemo(() => {
    const sourceList = (heritageItems && heritageItems.length > 0 && (!selectedStateId || selectedStateId === 'all'))
      ? heritageItems
      : HERITAGE_ITEMS;

    let list = (!selectedStateId || selectedStateId === 'all')
      ? sourceList
      : HERITAGE_ITEMS.filter((item) => item.state_id === selectedStateId);

    if (epochFilter !== 'all') {
      list = list.filter((item) => item.period === epochFilter);
    }
    const seen = new Set<string>();
    const uniqueList = list.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    return sortMonumentsByPopularity(uniqueList);
  }, [heritageItems, selectedStateId, epochFilter]);

  const stateFestivals = useMemo(() => {
    const list = (!selectedStateId || selectedStateId === 'all')
      ? FESTIVALS
      : FESTIVALS.filter((f) => f.state_id === selectedStateId);
    const seen = new Set<string>();
    return list.filter((f) => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    });
  }, [selectedStateId]);

  const stateFoods = useMemo(() => {
    const list = (!selectedStateId || selectedStateId === 'all')
      ? FOODS
      : FOODS.filter((f) => f.state_id === selectedStateId);
    const seen = new Set<string>();
    return list.filter((f) => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    });
  }, [selectedStateId]);

  const stateLanguages = useMemo(() => {
    const list = (!selectedStateId || selectedStateId === 'all')
      ? LANGUAGES
      : LANGUAGES.filter((l) => l.state_id === selectedStateId);
    const seen = new Set<string>();
    return list.filter((l) => {
      if (seen.has(l.id)) return false;
      seen.add(l.id);
      return true;
    });
  }, [selectedStateId]);

  const stateTraditions = useMemo(() => {
    const list = (!selectedStateId || selectedStateId === 'all')
      ? TRADITIONS
      : TRADITIONS.filter((t) => t.state_id === selectedStateId);
    const seen = new Set<string>();
    return list.filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
  }, [selectedStateId]);

  const stateCrafts = useMemo(() => {
    const list = (!selectedStateId || selectedStateId === 'all')
      ? CRAFTS
      : CRAFTS.filter((c) => c.state_id === selectedStateId);
    const seen = new Set<string>();
    return list.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [selectedStateId]);

  // Pronounce language greeting using browser Web Speech API with authentic Indian voice configuration
  const handleSpeakGreeting = useCallback((text: string, langId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeakingLanguageId(langId);

    const cleanText = text.replace(/\(.*?\)/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // BCP-47 mapping for Indic languages
    const langMap: Record<string, string> = {
      tamil: 'ta-IN',
      telugu: 'te-IN',
      kannada: 'kn-IN',
      malayalam: 'ml-IN',
      bengali: 'bn-IN',
      marathi: 'mr-IN',
      gujarati: 'gu-IN',
      punjabi: 'pa-IN',
      odia: 'or-IN',
      oriya: 'or-IN',
      assamese: 'as-IN',
      urdu: 'ur-IN',
      sanskrit: 'sa-IN',
      hindi: 'hi-IN',
      english: 'en-IN',
      maithili: 'mai-IN',
      konkani: 'kok-IN',
      dogri: 'doi-IN',
      kashmiri: 'ks-IN',
      santali: 'sat-IN',
      manipuri: 'mni-IN',
      bodo: 'brx-IN',
      nepali: 'ne-NP',
      sindhi: 'sd-IN',
    };

    const targetCode = langMap[langId.toLowerCase()] || 'hi-IN';
    utterance.lang = targetCode;
    utterance.pitch = 1.0;
    utterance.rate = 0.92; // Natural cadence and clear articulation for Indian terminology

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const cleanTarget = targetCode.toLowerCase().replace('_', '-');
      const prefix = cleanTarget.split('-')[0];

      let selectedVoice = voices.find(
        (v) => v.lang.toLowerCase().replace('_', '-') === cleanTarget
      );

      if (!selectedVoice) {
        selectedVoice = voices.find((v) => {
          const vLang = v.lang.toLowerCase().replace('_', '-');
          return (
            vLang.startsWith(prefix) &&
            (vLang.includes('in') || v.name.toLowerCase().includes('india'))
          );
        });
      }

      if (!selectedVoice) {
        selectedVoice = voices.find((v) =>
          v.lang.toLowerCase().replace('_', '-').startsWith(prefix)
        );
      }

      if (!selectedVoice) {
        selectedVoice = voices.find((v) => {
          const vLang = v.lang.toLowerCase();
          const vName = v.name.toLowerCase();
          return (
            vLang.includes('hi') ||
            vLang.includes('in') ||
            vName.includes('india') ||
            vName.includes('hindi') ||
            vName.includes('rishi') ||
            vName.includes('veena')
          );
        });
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => setSpeakingLanguageId(null);
    utterance.onerror = () => setSpeakingLanguageId(null);

    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSelectAllIndia = useCallback(() => {
    onSelectState(null);
  }, [onSelectState]);

  const handleSelectStateItem = useCallback((id: string) => {
    onSelectState(id);
  }, [onSelectState]);

  const handleClearSearch = useCallback(() => {
    setStateSearch('');
  }, []);

  return (
    <section
      id="state-explorer"
      className="py-10 sm:py-14 bg-[#FAF7F2] dark:bg-[#05070a] text-stone-900 dark:text-[#dfe7e0] border-b border-stone-200 dark:border-white/[0.08] transition-colors w-full max-w-full min-w-0 overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Curatorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-10 pb-5 sm:pb-6 border-b border-stone-200 dark:border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e0231c] dark:text-[#ff5a3c] mb-1.5">
              <span>{getUIText('national_archive_tag', lang)}</span>
              <span aria-hidden="true" className="text-stone-400 dark:text-zinc-600">·</span>
              <span className="text-amber-700 dark:text-[#c9a24a]">{getUIText('states_dir_tag', lang)}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 dark:text-white tracking-tight">
              {getUIText('explore_heading', lang)}
            </h2>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {getUIText('explore_subheading', lang)}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {(onOpenContribute || onOpenAdmin) && (
              <button
                onClick={onOpenContribute || onOpenAdmin}
                className="btn-glass-clay btn-glass-clay-crimson flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                title={getUIText('add_heritage_btn', lang)}
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span>{getUIText('add_heritage_btn', lang)}</span>
              </button>
            )}

            {currentState && (
              <button
                onClick={handleSelectAllIndia}
                className="btn-glass-clay btn-glass-clay-secondary px-3.5 sm:px-4 py-2 text-xs font-medium rounded-xl cursor-pointer"
              >
                {getUIText('reset_all_india', lang)}
              </button>
            )}
          </div>
        </div>

        {/* STEP 1: STATE SELECTION BAR */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                {getUIText('step_1_title', lang)}
              </span>
              <span className="text-xs text-stone-500 dark:text-zinc-400">
                ({filteredStates.length} {getUIText('available', lang)})
              </span>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              {REGION_BUTTONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`btn-glass-clay btn-glass-clay-tab px-3 py-1.5 rounded-xl font-medium cursor-pointer whitespace-nowrap shrink-0 text-xs ${
                    regionFilter === r
                      ? 'btn-glass-clay-tab-active shadow-md'
                      : 'btn-glass-clay-tab-inactive'
                  }`}
                >
                  {getRegionName(r, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search & Dropdown Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-4">
            {/* Search Input */}
            <div className="sm:col-span-2 relative flex items-center bg-white dark:bg-[#0a0e12]/90 rounded-xl border border-stone-300 dark:border-white/15 px-3.5 py-2.5 text-xs focus-within:border-[#e0231c]">
              <Search className="w-4 h-4 text-stone-400 dark:text-zinc-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'Search state name, capital (e.g. Rajasthan, Kerala, Shimla)...'
                    : `${getUIText('step_1_title', lang)} (e.g. Rajasthan, Kerala, Shimla)...`
                }
                className="w-full bg-transparent text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none"
              />
              {stateSearch && (
                <button
                  onClick={handleClearSearch}
                  className="btn-glass-clay btn-glass-clay-icon w-6 h-6 text-xs text-stone-400 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white ml-1 cursor-pointer shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Direct Jump Dropdown */}
            <div className="relative">
              <select
                value={selectedStateId || 'all'}
                onChange={(e) => onSelectState(e.target.value === 'all' ? null : e.target.value)}
                className="w-full h-full px-3.5 py-2.5 bg-white dark:bg-[#0a0e12] rounded-xl border border-stone-300 dark:border-white/15 text-xs font-medium text-stone-900 dark:text-white focus:outline-none focus:border-[#e0231c] cursor-pointer"
              >
                <option value="all">
                  🇮🇳 {getUIText('all_india_label', lang)} ({states.length} {getUIText('available', lang)})
                </option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {getStateName(s, lang)} ({s.capital}) - {getRegionName(s.region, lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* State Visual Strip / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5 max-h-56 sm:max-h-60 overflow-y-auto pr-1 pb-1">
            {/* All India Card */}
            <button
              onClick={handleSelectAllIndia}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between backdrop-blur-md ${
                !selectedStateId
                  ? 'border-[#e0231c] bg-[#e0231c]/15 ring-2 ring-[#e0231c]/40 shadow-[0_6px_18px_rgba(224,35,28,0.25)]'
                  : 'btn-glass-clay-secondary border-stone-300 dark:border-white/10 hover:border-[#e0231c]/50'
              }`}
              style={{
                boxShadow: !selectedStateId
                  ? '0 6px 18px -2px rgba(224, 35, 28, 0.3), inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.4), inset -2px -2px 3.5px rgba(0, 0, 0, 0.25)'
                  : undefined
              }}
            >
              <div>
                <span className="text-lg block">🇮🇳</span>
                <span className="font-serif font-bold text-xs text-stone-900 dark:text-white block mt-1">
                  {getUIText('all_india_label', lang)}
                </span>
                <span className="text-[10px] text-stone-500 dark:text-zinc-400 block">
                  {getUIText('national_repo', lang)}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#e0231c] dark:text-[#ff5a3c] mt-2 block font-medium">
                {HERITAGE_ITEMS.length} {getUIText('records_label', lang)}
              </span>
            </button>

            {/* Individual State Cards */}
            {filteredStates.map((s, idx) => (
              <StateCard
                key={s.id}
                state={s}
                isSelected={selectedStateId === s.id}
                itemCount={stateCountsMap.get(s.id) || 0}
                lang={lang}
                onSelect={handleSelectStateItem}
                staggerIndex={idx}
              />
            ))}
          </div>
        </div>

        {/* ACTIVE STATE OVERVIEW HERO (if state selected) */}
        {currentState && (
          <div className="mb-8 sm:mb-10 rounded-2xl border border-stone-200 dark:border-white/15 bg-gradient-to-br from-white via-[#faf7f2] to-[#f4ede2] dark:from-[#0e131a] dark:via-[#0a0e12] dark:to-[#070a0e] p-4 sm:p-6 shadow-md dark:shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e0231c] dark:text-[#ff5a3c] mb-1">
                  <span>{getRegionName(currentState.region, lang)}</span>
                  <span aria-hidden="true" className="text-stone-400 dark:text-zinc-600">·</span>
                  <span className="text-amber-700 dark:text-[#c9a24a]">{getUIText('capital', lang)}: {currentState.capital}</span>
                  <span aria-hidden="true" className="text-stone-400 dark:text-zinc-600">·</span>
                  <span className="text-stone-500 dark:text-zinc-400">{getUIText('coordinates', lang)}: {currentState.lat.toFixed(2)}°N, {currentState.lng.toFixed(2)}°E</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                  {getStateName(currentState, lang)}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
                  {getStateOverview(currentState, lang)}
                </p>
              </div>

              {onOpenStatePanel && (
                <button
                  onClick={() => onOpenStatePanel(currentState.id)}
                  className="btn-glass-clay btn-glass-clay-secondary px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#e0231c] dark:text-[#ff5a3c]" />
                  <span>{getUIText('view_full_archive', lang)}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: CATEGORY SELECTOR ("WHAT DO YOU WANT TO SEE?") */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-white">
              {getUIText('step_2_title', lang)}
            </span>
            <span className="text-xs text-stone-500 dark:text-zinc-400">
              {currentState ? getStateName(currentState, lang) : getUIText('all_india_label', lang)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 w-full">
            {CATEGORY_TABS.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const catInfo = getCategoryLabel(cat.id, lang);

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`btn-glass-clay p-3 sm:p-3.5 rounded-2xl border text-left cursor-pointer flex flex-col justify-between w-full min-w-0 overflow-hidden transition-all ${
                    isActive
                      ? 'btn-glass-clay-tab-active shadow-lg ring-1 ring-white/30'
                      : 'btn-glass-clay-tab-inactive'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-[#e0231c]/10 dark:bg-[#ff5a3c]/15 text-[#e0231c] dark:text-[#ff5a3c]'}`}>
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    {isActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />}
                  </div>

                  <div className="w-full min-w-0">
                    <span className="font-serif font-bold text-xs sm:text-[13px] block leading-tight truncate">
                      {catInfo.name}
                    </span>
                    <span className={`text-[10px] sm:text-[11px] block mt-1 line-clamp-2 leading-snug break-words whitespace-normal ${isActive ? 'text-white/85' : 'text-stone-500 dark:text-zinc-400'}`}>
                      {catInfo.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3: DYNAMIC RESULTS SHOWCASE */}
        <div className="mt-8">
          {isFiltering ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-48 h-4 rounded-md bg-stone-200 dark:bg-white/10 animate-pulse" />
                <div className="w-24 h-4 rounded-md bg-stone-200 dark:bg-white/10 animate-pulse" />
              </div>
              <StateCategoryExplorerSkeleton type={activeCategory} count={6} />
            </div>
          ) : (
            <div key={`${selectedStateId || 'all'}-${activeCategory}-${epochFilter}`} className="animate-category-slide">
              {/* CATEGORY 1: MONUMENTS */}
              {activeCategory === 'monuments' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                  {currentState ? getStateName(currentState, lang) : getUIText('all_india_label', lang)} · {getUIText('monuments_heading', lang)} ({stateMonuments.length})
                </span>

                {/* Architectural Dynastic Epoch Ribbon */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 shrink-0 flex items-center gap-1 mr-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{getUIText('era_suffix', lang)}:</span>
                  </span>
                  {EPOCH_OPTIONS.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setEpochFilter(ep.id)}
                      className={`btn-glass-clay px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-medium cursor-pointer whitespace-nowrap shrink-0 text-xs transition-all ${
                        epochFilter === ep.id
                          ? 'btn-glass-clay-primary text-white shadow-md'
                          : 'btn-glass-clay-secondary text-stone-600 dark:text-zinc-400'
                      }`}
                    >
                      <span>{getEpochName(ep.id, lang, ep.label)}</span>
                      <span className="text-[10px] opacity-75 ml-1 hidden md:inline">({ep.epoch})</span>
                    </button>
                  ))}
                </div>
              </div>

              {stateMonuments.length === 0 ? (
                <div className="p-6 sm:p-8 text-center border border-dashed border-stone-300 dark:border-white/15 rounded-2xl bg-stone-50/50 dark:bg-white/[0.02] max-w-xl mx-auto">
                  <h5 className="font-serif font-bold text-base text-stone-900 dark:text-white mb-2">
                    {currentState ? getStateName(currentState, lang) : getUIText('all_india_label', lang)} · {getUIText('monuments_heading', lang)}
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed mb-4">
                    {currentState ? getStateOverview(currentState, lang) : (lang === 'hi' ? 'इस कालखंड के लिए कोई विशिष्ट स्मारक फ़िल्टर में नहीं मिला।' : 'No specific monument records match the current filter.')}
                  </p>
                  <button
                    onClick={() => setEpochFilter('all')}
                    className="btn-glass-clay btn-glass-clay-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer text-white inline-flex items-center gap-1.5 shadow-md"
                  >
                    <span>{lang === 'hi' ? 'सभी कालखंड देखें' : 'View All Eras'}</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {stateMonuments.slice(0, visibleItemCount).map((item, idx) => (
                      <MonumentCard
                        key={`${item.id}-${idx}`}
                        item={item}
                        isSaved={savedItemIds.has(item.id)}
                        lang={lang}
                        onSelectItem={onSelectItem}
                        onToggleSave={onToggleSave}
                        staggerIndex={idx}
                      />
                    ))}
                  </div>

                  {stateMonuments.length > visibleItemCount && (
                    <div className="text-center pt-6 pb-2">
                      <button
                        type="button"
                        onClick={() => setVisibleItemCount((prev) => prev + 24)}
                        className="btn-glass-clay btn-glass-clay-primary px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold cursor-pointer text-white shadow-lg inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>
                          {lang === 'hi'
                            ? `और स्मारक लोड करें (${stateMonuments.length - visibleItemCount} शेष)`
                            : `Load More Monuments (${stateMonuments.length - visibleItemCount} remaining)`}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* CATEGORY 2: FESTIVALS */}
          {activeCategory === 'festivals' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                  {currentState ? getStateName(currentState, lang) : getUIText('all_india_label', lang)} · {getUIText('festivals_heading', lang)} ({stateFestivals.length})
                </span>
              </div>

              {stateFestivals.length === 0 ? (
                <div className="p-6 sm:p-8 text-center border border-dashed border-[#DDD6CB] dark:border-[#38332E] rounded-xl text-sm text-[#78716C]">
                  {currentState ? (
                    <div>
                      <h5 className="font-serif font-bold text-base text-[#1C1917] dark:text-[#FAF8F5] mb-2">
                        {getStateName(currentState, lang)} {getUIText('festivals_heading', lang)}
                      </h5>
                      <p className="text-xs max-w-xl mx-auto text-[#57534E] dark:text-[#C7C2BA]">
                        {getStateFestivals(currentState, lang)}
                      </p>
                    </div>
                  ) : (
                    getUIText('no_festivals_listed', lang) || 'No specific festival records listed for this selection.'
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {stateFestivals.slice(0, visibleItemCount).map((fest, idx) => (
                      <FestivalCard
                        key={`${fest.id}-${idx}`}
                        fest={fest}
                        stateObj={statesMap.get(fest.state_id)}
                        lang={lang}
                        staggerIndex={idx}
                      />
                    ))}
                  </div>

                  {stateFestivals.length > visibleItemCount && (
                    <div className="text-center pt-6 pb-2">
                      <button
                        type="button"
                        onClick={() => setVisibleItemCount((prev) => prev + 24)}
                        className="btn-glass-clay btn-glass-clay-primary px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold cursor-pointer text-white shadow-lg inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>
                          {lang === 'hi'
                            ? `और त्योहार लोड करें (${stateFestivals.length - visibleItemCount} शेष)`
                            : `Load More Festivals (${stateFestivals.length - visibleItemCount} remaining)`}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* CATEGORY 3: TRADITIONS & LIVING CULTURE */}
          {activeCategory === 'traditions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                  {currentState ? getStateName(currentState, lang) : getUIText('all_india_label', lang)} · {getUIText('traditions_heading', lang)} ({stateTraditions.length > 0 ? stateTraditions.length : 'Pan-India'})
                </span>
              </div>

              {stateTraditions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {stateTraditions.map((tradition, idx) => (
                    <TraditionCard
                      key={`${tradition.id}-${idx}`}
                      tradition={tradition}
                      stateObj={statesMap.get(tradition.state_id)}
                      lang={lang}
                      staggerIndex={idx}
                    />
                  ))}
                </div>
              ) : currentState ? (
                <div className="bg-white dark:bg-[#1C1A17] rounded-2xl border border-[#E5DFD5] dark:border-[#2C2926] p-4 sm:p-6 shadow-xs">
                  <h4 className="font-serif font-bold text-lg sm:text-xl text-[#1C1917] dark:text-[#FAF8F5] mb-3">
                    {getStateName(currentState, lang)} · {getUIText('traditions_heading', lang)}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#44403C] dark:text-[#D6D3D1] leading-relaxed">
                    {getStateCulture(currentState, lang)}
                  </p>

                  <div className="mt-6 pt-6 border-t border-[#EFE8DD] dark:border-[#2A2724] grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EFE8DD] dark:border-[#2A2724]">
                      <span className="font-serif font-bold text-sm text-[#1C1917] dark:text-[#FAF8F5] block mb-1">
                        {getUIText('performing_arts_title', lang)}
                      </span>
                      <p className="text-xs text-[#57534E] dark:text-[#C7C2BA] leading-relaxed">
                        {getUIText('performing_arts_desc', lang)}
                      </p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#141312] border border-[#EFE8DD] dark:border-[#2A2724]">
                      <span className="font-serif font-bold text-sm text-[#1C1917] dark:text-[#FAF8F5] block mb-1">
                        {getUIText('sanctuary_title', lang)}
                      </span>
                      <p className="text-xs text-[#57534E] dark:text-[#C7C2BA] leading-relaxed">
                        {getUIText('sanctuary_desc', lang)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {TRADITIONS.map((tradition, idx) => (
                    <TraditionCard
                      key={`${tradition.id}-${idx}`}
                      tradition={tradition}
                      stateObj={statesMap.get(tradition.state_id)}
                      lang={lang}
                      staggerIndex={idx}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 4: ART, CRAFTS & TEXTILES */}
          {activeCategory === 'arts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                  {currentState ? getStateName(currentState, lang) : getUIText('all_india_label', lang)} · {getUIText('arts_heading', lang)} ({stateCrafts.length > 0 ? stateCrafts.length : 'Pan-India'})
                </span>
              </div>

              {stateCrafts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {stateCrafts.map((craft, idx) => (
                    <CraftCard
                      key={`${craft.id}-${idx}`}
                      craft={craft}
                      stateObj={statesMap.get(craft.state_id)}
                      lang={lang}
                      staggerIndex={idx}
                    />
                  ))}
                </div>
              ) : currentState ? (
                <div className="bg-white dark:bg-[#1C1A17] rounded-2xl border border-[#E5DFD5] dark:border-[#2C2926] p-4 sm:p-6 shadow-xs animate-fadeIn">
                  <h4 className="font-serif font-bold text-lg sm:text-xl text-[#1C1917] dark:text-[#FAF8F5] mb-2">
                    {getStateName(currentState, lang)} · {getUIText('arts_heading', lang)}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#44403C] dark:text-[#D6D3D1] leading-relaxed">
                    {getStateArtCrafts(currentState, lang)}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {CRAFTS.map((craft, idx) => (
                    <CraftCard
                      key={`${craft.id}-${idx}`}
                      craft={craft}
                      stateObj={statesMap.get(craft.state_id)}
                      lang={lang}
                      staggerIndex={idx}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 5: LANGUAGES & EPIGRAPHY */}
          {activeCategory === 'languages' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                  {lang === 'hi' ? `भाषाएं, प्राचीन लिपियां एवं अभिवादन (${stateLanguages.length})` : `Languages, Ancient Scripts & Greetings (${stateLanguages.length})`}
                </span>
              </div>

              {stateLanguages.length === 0 ? (
                <div className="p-6 sm:p-8 text-center border border-dashed border-[#DDD6CB] dark:border-[#38332E] rounded-xl text-sm text-[#78716C]">
                  {currentState ? (
                    <div>
                      <h5 className="font-serif font-bold text-base text-[#1C1917] dark:text-[#FAF8F5] mb-2">
                        {lang === 'hi' ? `${currentState.hindi_name || currentState.name} का भाषाई परिचय` : `${currentState.name} Linguistic Profile`}
                      </h5>
                      <p className="text-xs max-w-xl mx-auto text-[#57534E] dark:text-[#C7C2BA]">
                        {getStateLanguages(currentState, lang)}
                      </p>
                    </div>
                  ) : (
                    lang === 'hi' ? 'कोई भाषा विवरण नहीं मिला।' : 'No language records found.'
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {stateLanguages.map((langItem, idx) => (
                    <LanguageCard
                      key={`${langItem.id}-${idx}`}
                      langItem={langItem}
                      stateObj={statesMap.get(langItem.state_id)}
                      isSpeaking={speakingLanguageId === langItem.id}
                      lang={lang}
                      onSpeak={handleSpeakGreeting}
                      staggerIndex={idx}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 6: REGIONAL FOOD */}
          {activeCategory === 'food' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                  {lang === 'hi' ? `क्षेत्रीय खानपान एवं पारंपरिक व्यंजन (${stateFoods.length})` : `Regional Food & Traditional Cuisines (${stateFoods.length})`}
                </span>
              </div>

              {stateFoods.length === 0 ? (
                <div className="p-6 sm:p-8 text-center border border-dashed border-[#DDD6CB] dark:border-[#38332E] rounded-xl text-sm text-[#78716C]">
                  {currentState ? (
                    <div>
                      <h5 className="font-serif font-bold text-base text-[#1C1917] dark:text-[#FAF8F5] mb-2">
                        {lang === 'hi' ? `${currentState.hindi_name || currentState.name} की व्यंजन परंपरा` : `${currentState.name} Culinary Heritage`}
                      </h5>
                      <p className="text-xs max-w-xl mx-auto text-[#57534E] dark:text-[#C7C2BA]">
                        {getStateFood(currentState, lang)}
                      </p>
                    </div>
                  ) : (
                    lang === 'hi' ? 'इस चयन के लिए कोई व्यंजन उपलब्ध नहीं है।' : 'No food items found for this selection.'
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {stateFoods.slice(0, visibleItemCount).map((food, idx) => (
                      <FoodCard
                        key={`${food.id}-${idx}`}
                        food={food}
                        stateObj={statesMap.get(food.state_id)}
                        lang={lang}
                        staggerIndex={idx}
                      />
                    ))}
                  </div>

                  {stateFoods.length > visibleItemCount && (
                    <div className="text-center pt-6 pb-2">
                      <button
                        type="button"
                        onClick={() => setVisibleItemCount((prev) => prev + 24)}
                        className="btn-glass-clay btn-glass-clay-primary px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold cursor-pointer text-white shadow-lg inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>
                          {lang === 'hi'
                            ? `और व्यंजन लोड करें (${stateFoods.length - visibleItemCount} शेष)`
                            : `Load More Cuisines (${stateFoods.length - visibleItemCount} remaining)`}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const StateCategoryExplorer = React.memo(StateCategoryExplorerComponent);
