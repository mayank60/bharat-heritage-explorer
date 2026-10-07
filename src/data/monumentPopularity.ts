import { HeritageItem } from '../types.ts';

/**
 * Curated popularity score registry for Indian heritage sites, monuments, and cultural landmarks.
 * Scores are ranked in descending order (highest popularity first, lowest last).
 * Factors: Annual tourist footfall, UNESCO World Heritage status, global and national cultural prominence.
 */
export const MONUMENT_POPULARITY_MAP: Record<string, number> = {
  // === TIER 1: GLOBAL WONDERS & SUPREME NATIONAL ICONS (Score 9000 - 10000) ===
  'taj-mahal': 10000,
  'qutub-minar': 9900,
  'red-fort': 9850,
  'india-gate': 9800,
  'delhi-india-gate': 9800,
  'amber-fort': 9750,
  'hawa-mahal': 9700,
  'gateway-of-india': 9650,
  'maharashtra-gateway-of-india': 9650,
  'golden-temple-amritsar': 9600,
  'punjab-golden-temple': 9600,
  'ajanta-caves': 9550,
  'ellora-caves': 9500,
  'konark-sun-temple': 9450,
  'odisha-konark-sun-temple': 9450,
  'meenakshi-temple': 9400,
  'tamil-nadu-meenakshi-temple': 9400,
  'hampi-monuments': 9350,
  'karnataka-hampi': 9350,
  'khajuraho-temples': 9300,
  'madhya-pradesh-khajuraho': 9300,
  'sanchi-stupa': 9250,
  'madhya-pradesh-sanchi': 9250,
  'victoria-memorial': 9200,
  'west-bengal-victoria-memorial': 9200,
  'charminar': 9150,
  'telangana-charminar': 9150,
  'golconda-fort': 9100,
  'telangana-golconda': 9100,
  'mahabodhi-temple': 9050,
  'bihar-mahabodhi-temple': 9050,
  'brihadisvara-temple': 9000,
  'tamil-nadu-brihadisvara': 9000,
  'mysore-palace': 8950,
  'karnataka-mysore-palace': 8950,

  // === TIER 2: HIGH POPULARITY REGIONAL STRONGHOLDS & CITIES (Score 8000 - 8940) ===
  'mehrangarh-fort': 8900,
  'jaisalmer-fort': 8850,
  'chittorgarh-fort': 8800,
  'humayuns-tomb': 8750,
  'delhi-humayuns-tomb': 8750,
  'lotus-temple': 8700,
  'delhi-lotus-temple': 8700,
  'shikharji-parasnath': 8650,
  'padmanabhaswamy-temple': 8600,
  'somnath-temple': 8550,
  'gujarat-somnath': 8550,
  'statue-of-unity': 8500,
  'gujarat-statue-of-unity': 8500,
  'rani-ki-vav': 8450,
  'gujarat-rani-ki-vav': 8450,
  'kamakhya-temple': 8400,
  'assam-kamakhya-temple': 8400,
  'kaziranga-national-park': 8350,
  'assam-kaziranga': 8350,
  'puri-jagannath-temple': 8300,
  'odisha-puri-jagannath': 8300,
  'varanasi-ghats': 8250,
  'uttar-pradesh-kashi-vishwanath': 8250,
  'fatehpur-sikri': 8200,
  'uttar-pradesh-fatehpur-sikri': 8200,
  'elephanta-caves': 8150,
  'csmt-station': 8100,
  'mahabalipuram': 8050,
  'tamil-nadu-mahabalipuram': 8050,
  'cellular-jail': 8000,
  'andaman-cellular-jail': 8000,

  // === TIER 3: MAJOR HISTORIC LANDMARKS & PILGRIMAGES (Score 7000 - 7990) ===
  'howrah-bridge': 7950,
  'nalanda-mahavihara': 7900,
  'bihar-nalanda': 7900,
  'vaishno-devi': 7850,
  'jammu-kashmir-vaishno-devi': 7850,
  'amarnath-cave': 7800,
  'jammu-kashmir-amarnath': 7800,
  'kedarnath-temple': 7750,
  'uttarakhand-kedarnath': 7750,
  'badrinath-temple': 7700,
  'uttarakhand-badrinath': 7700,
  'agra-fort': 7650,
  'jantar-mantar-jaipur': 7600,
  'sun-temple-modhera': 7550,
  'dholavira-harappan-city': 7500,
  'dholavira': 7500,
  'gwalior-fort': 7450,
  'madhya-pradesh-gwalior': 7450,
  'bhimbetka-rock-shelters': 7400,
  'bhimbetka': 7400,
  'shravanabelagola': 7350,
  'pattadakal-monuments': 7300,
  'pattadakal': 7300,
  'hoysala-temples-belur-halebidu': 7250,
  'belur-halebidu': 7250,
  'ramappa-temple': 7200,
  'tirupati-balaji': 7150,
  'andhra-pradesh-tirupati': 7150,
  'lepakshi-veerabhadra': 7100,
  'sundarbans-mangroves': 7050,
  'tawang-monastery': 7000,
  'arunachal-tawang': 7000,

  // === TIER 4: CULTURAL GEMS & LIVING HERITAGE SITES (Score 5500 - 6990) ===
  'living-root-bridges': 6950,
  'meghalaya-living-root-bridges': 6950,
  'rumtek-monastery': 6900,
  'sikkim-rumtek': 6900,
  'loktak-lake': 6850,
  'manipur-loktak': 6850,
  'unakoti-rock-carvings': 6800,
  'tripura-unakoti': 6800,
  'reiek-heritage-village': 6750,
  'mizoram-reiek': 6750,
  'kisama-heritage-village': 6700,
  'nagaland-kisama': 6700,
  'dakshineswar-kali-temple': 6650,
  'santiniketan': 6600,
  'bishnupur-terracotta-temples': 6550,
  'bara-imambara': 6500,
  'sarnath-dhamek-stupa': 6450,
  'mattancherry-palace': 6400,
  'bekal-fort': 6350,
  'thanjavur-maratha-palace': 6300,
  'kailasanathar-temple': 6250,
  'ramanathaswamy-temple': 6200,
  'nilgiri-mountain-railway': 6150,
  'gangaikonda-cholapuram': 6100,
  'rock-garden-chandigarh': 6050,
  'capitol-complex-chandigarh': 6000,
  'pinjore-yadavindra-gardens': 5950,
  'sheikh-chilli-tomb': 5900,
  'sukhna-lake-chandigarh': 5850,
  'gol-gumbaz-vijayapura': 5800,
  'lingaraja-temple': 5750,
  'baidyanath-dham-deoghar': 5700,
  'ranchi-sun-temple': 5650,
  'khangchendzonga-biosphere': 5600,
  'basilica-bom-jesus-goa': 5550,
  'fort-aguada-goa': 5500,

  // === TIER 5: REGIONAL TREASURES & STATE SITES (Score 4000 - 5490) ===
  'jallianwala-bagh': 5450,
  'qila-mubarak-patiala': 5400,
  'anandpur-sahib-virasat': 5350,
  'martand-sun-temple': 5300,
  'shalimar-bagh-srinagar': 5250,
  'leh-palace': 5200,
  'hemis-monastery': 5150,
  'thiksey-monastery': 5100,
  'kangra-fort': 5050,
  'hidimba-devi-temple': 5000,
  'tabo-monastery': 4950,
  'baijnath-temple': 4900,
  'jageshwar-dham': 4850,
  'tungnath-chandrashila': 4800,
  'surajkund-sun-pool': 4750,
  'kurukshetra-brahma-sarovar': 4700,
  'chhatrapati-shivaji-maharaj-vastu-sangrahalaya': 4650,
  'shaniwar-wada': 4600,
  'sindhudurg-sea-fort': 4550,
  'pratapgad-fort': 4500,
  'raigad-fort': 4450,
  'murud-janjira-fort': 4400,
  'daulatabad-fort': 4350,
  'bibi-ka-maqbara': 4300,
  'orcha-palace-complex': 4250,
  'mandu-jahaz-mahal': 4200,
  'ujjain-mahakaleshwar': 4150,
  'omkareshwar-jyotirlinga': 4100,
  'bhoramdeo-temple': 4050,
  'sirpur-monuments': 4000
};

/**
 * Calculates a reliable popularity score for any HeritageItem.
 */
export function getMonumentPopularityScore(item: HeritageItem): number {
  if (!item || !item.id) return 0;

  // 1. Direct key match
  if (MONUMENT_POPULARITY_MAP[item.id] !== undefined) {
    return MONUMENT_POPULARITY_MAP[item.id];
  }

  // 2. State-prefixed fallback key match (e.g. "uttar-pradesh-taj-mahal")
  const prefixedKey = `${item.state_id}-${item.id}`;
  if (MONUMENT_POPULARITY_MAP[prefixedKey] !== undefined) {
    return MONUMENT_POPULARITY_MAP[prefixedKey];
  }

  // 3. Substring / fuzzy id matching for popular aliases
  for (const [key, score] of Object.entries(MONUMENT_POPULARITY_MAP)) {
    if (item.id.includes(key) || key.includes(item.id)) {
      return score;
    }
  }

  // 4. Default algorithmic score based on UNESCO status, gallery depth, and text richness
  let fallbackScore = 3000;
  if (item.unesco_flag) fallbackScore += 1500;
  if (item.gallery && item.gallery.length > 0) fallbackScore += Math.min(item.gallery.length * 50, 400);
  if (item.video_url) fallbackScore += 200;
  if (item.history && item.history.length > 200) fallbackScore += 100;

  return fallbackScore;
}

/**
 * Sorts an array of HeritageItem in descending popularity order (High Popular -> Low Popular).
 * Preserves stable secondary sort by UNESCO status and title.
 */
export function sortMonumentsByPopularity(items: HeritageItem[]): HeritageItem[] {
  return [...items].sort((a, b) => {
    const scoreA = getMonumentPopularityScore(a);
    const scoreB = getMonumentPopularityScore(b);
    if (scoreB !== scoreA) {
      return scoreB - scoreA; // Descending order: highest score first
    }
    // Secondary fallback: UNESCO flag
    if (a.unesco_flag !== b.unesco_flag) {
      return (b.unesco_flag ? 1 : 0) - (a.unesco_flag ? 1 : 0);
    }
    // Tertiary fallback: Alphabetical
    return a.title.localeCompare(b.title);
  });
}
