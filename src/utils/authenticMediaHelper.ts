// Authentic Indian Heritage Media Helper
// Automatically fetches authentic photographs from Wikimedia Commons & Wikipedia
// Provides verified government & tourism virtual tour embeds without manual URLs

const PHOTO_CACHE = new Map<string, string[]>();

/**
 * Curated monument video dictionary for sites without pre-seeded video URLs.
 * Maps normalized keywords to authentic verified YouTube documentary embeds and watch links.
 */
export const VERIFIED_MONUMENT_VIDEOS: Record<string, { embed: string; watch: string }> = {
  palamu: {
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
  'shikharji': {
    embed: 'https://www.youtube.com/embed/0kUlTwf9oZE',
    watch: 'https://youtu.be/0kUlTwf9oZE',
  },
  'parasnath': {
    embed: 'https://www.youtube.com/embed/0kUlTwf9oZE',
    watch: 'https://youtu.be/0kUlTwf9oZE',
  },
  'baidyanath-dham': {
    embed: 'https://www.youtube.com/embed/5G-FP7ciOkA',
    watch: 'https://youtu.be/5G-FP7ciOkA',
  },
  'maluti-temples': {
    embed: 'https://www.youtube.com/embed/6FpgsrZ3THE',
    watch: 'https://youtu.be/6FpgsrZ3THE',
  },
};

export const NATIONAL_HERITAGE_TOUR_EMBED = 'https://www.youtube-nocookie.com/embed/0kUlTwf9oZE';

/**
 * Searches Wikipedia and Wikimedia Commons for authentic, high-res historical photographs.
 * Uses a multi-tier high-speed strategy with CDN thumbnails:
 * Tier 1: Wikipedia REST summary API
 * Tier 2: Wikipedia PageImages search with 800px CDN thumbnails
 * Tier 3: Wikimedia Commons direct photographic file search with iiurlwidth=800 CDN thumbnails
 * Eliminates 30MB RAW downloads to ensure 0 lag and snappy performance!
 */
export async function fetchAuthenticHeritagePhotos(
  query: string,
  locationOrLimit?: string | number,
  maybeLimit?: number
): Promise<string[]> {
  const location = typeof locationOrLimit === 'string' ? locationOrLimit : undefined;
  const limit = typeof locationOrLimit === 'number' ? locationOrLimit : (maybeLimit || 6);

  // Preserve crucial heritage keywords (Fort, Temple, Palace, Caves)
  const cleanTitle = (query || '')
    .trim()
    .replace(/[^\w\s\u0900-\u097F]/gi, ' ')
    .replace(/\s+/g, ' ');

  if (!cleanTitle || cleanTitle.length < 2) return [];

  const cacheKey = `${cleanTitle.toLowerCase()}__${(location || '').toLowerCase()}`;
  if (PHOTO_CACHE.has(cacheKey)) {
    return PHOTO_CACHE.get(cacheKey) || [];
  }

  const results: string[] = [];
  const seenUrls = new Set<string>();

  const addUrl = (url: string, title?: string) => {
    if (url && isValidPhotoUrl(url, title) && !seenUrls.has(url)) {
      seenUrls.add(url);
      results.push(url);
    }
  };

  // 1. Wikipedia Direct REST Summary API (Most accurate for specific landmarks)
  const summaryCandidates = [
    cleanTitle.replace(/\s+/g, '_'),
    cleanTitle.replace(/s\b/gi, '').replace(/\s+/g, '_'),
  ];

  for (const candidate of summaryCandidates) {
    if (results.length >= limit) break;
    try {
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(candidate)}`;
      const sRes = await fetch(summaryUrl);
      if (sRes.ok) {
        const sData = await sRes.json();
        // Use CDN thumbnail to prevent huge 50MB raw downloads and UI lag
        const heroPhoto = sData.thumbnail?.source || sData.originalimage?.source;
        if (heroPhoto) addUrl(heroPhoto, sData.title);
      }
    } catch {
      // Continue to next candidate
    }
  }

  // 2. Wikipedia PageImages Search API (Targeted search with high-speed CDN thumbnails)
  if (results.length < limit) {
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(
        cleanTitle
      )}&gsrlimit=6&prop=pageimages&piprop=thumbnail&pithumbsize=800`;

      const res = await fetch(wikiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data?.query?.pages) {
          const pages = Object.values(data.query.pages) as any[];
          pages.sort((a, b) => (a.index || 0) - (b.index || 0));

          for (const page of pages) {
            const pageTitle = (page.title || '').toLowerCase();
            if (isBroadRegionTitle(pageTitle)) continue;

            const imgUrl = page.thumbnail?.source;
            if (imgUrl) addUrl(imgUrl, page.title);
            if (results.length >= limit) break;
          }
        }
      }
    } catch (err) {
      console.warn('[AuthenticMedia] Wikipedia fetch error:', err);
    }
  }

  // 3. Wikimedia Commons API with CDN Thumbnails (iiurlwidth=800)
  // Fetches fast 80KB CDN thumbnails instead of 30MB RAW files to prevent browser freezing
  if (results.length < limit) {
    try {
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(
        cleanTitle
      )}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=800`;

      const res = await fetch(commonsUrl);
      if (res.ok) {
        const data = await res.json();
        if (data?.query?.pages) {
          const pages = Object.values(data.query.pages) as any[];
          for (const page of pages) {
            const info = page.imageinfo?.[0];
            // Prefer thumburl (fast CDN thumbnail) over raw url (multi-megabyte file)
            const imgUrl = info?.thumburl || info?.url;
            if (imgUrl) addUrl(imgUrl, page.title);
            if (results.length >= limit) break;
          }
        }
      }
    } catch (err) {
      console.warn('[AuthenticMedia] Wikimedia Commons fetch error:', err);
    }
  }

  PHOTO_CACHE.set(cacheKey, results);
  return results;
}

/**
 * Checks if a title is a broad region that often defaults to Taj Mahal or generic maps
 */
function isBroadRegionTitle(title: string): boolean {
  const broad = [
    'india',
    'north india',
    'south india',
    'east india',
    'west india',
    'central india',
    'northeast india',
    'tourism in india',
    'states and union territories of india',
  ];
  return broad.includes(title.trim().toLowerCase());
}

/**
 * Returns a single best authentic photo URL for a given title or null if not found
 */
export async function fetchAuthenticHeritagePhoto(query: string, location?: string): Promise<string | null> {
  const photos = await fetchAuthenticHeritagePhotos(query, location, 1);
  return photos.length > 0 ? photos[0] : null;
}

/**
 * Validates that an image URL represents a photograph rather than an icon, map, flag, or unrelated object
 */
function isValidPhotoUrl(url: string, contextTitle?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = (url + ' ' + (contextTitle || '')).toLowerCase();

  // Reject SVG vector graphics and non-photo media files
  if (
    lower.endsWith('.svg') ||
    lower.endsWith('.ogg') ||
    lower.endsWith('.pdf') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.tif') ||
    lower.endsWith('.tiff')
  ) {
    return false;
  }

  // Reject non-monument artifacts (stamps, maps, coins, railway stations, buses, offices)
  const unwantedKeywords = [
    'flag',
    'coat_of_arms',
    'seal_of',
    'emblem',
    'locator_map',
    'location_map',
    'district_map',
    'icon',
    'symbol',
    'logo',
    'schematic',
    'diagram',
    'stamp',
    'postage',
    'banknote',
    'coin',
    'railway_station',
    'railway station',
    'train_station',
    'train station',
    'platform',
    'collectorate',
    'secretariat',
    'police_station',
    'bus_stand',
    'airport',
  ];

  for (const kw of unwantedKeywords) {
    if (lower.includes(kw)) return false;
  }

  return true;
}

/**
 * Extracts a clean 11-character YouTube video ID from any YouTube URL.
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Generates an authentic virtual tour embed URL and watch link for a monument.
 * CRITICAL RULE: NEVER inject a random monument's video (e.g. Mamallapuram for Palamu Forts).
 * If no verified video exists for this specific monument, hasExactVideo will be false,
 * and a direct curated YouTube search link is provided to explore authentic documentaries.
 */
export function getAuthenticVirtualTourUrl(
  title: string,
  location?: string,
  existingUrl?: string
): {
  embedUrl: string | null;
  watchUrl: string;
  hasExactVideo: boolean;
  isAutoCurated: boolean;
  nationalTourEmbed: string;
} {
  const cleanTitle = (title || '').trim();
  const loc = location ? location.replace(/India/gi, '').trim() : '';

  // Direct YouTube watch/search link that opens seamlessly on YouTube App or browser
  const searchWatchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${cleanTitle} ${loc} documentary Incredible India ASI`
  )}`;

  // 1. If an existing valid YouTube URL or embed URL is provided (and not a broken listType=search)
  if (existingUrl && !existingUrl.includes('listType=search')) {
    const videoId = extractYouTubeVideoId(existingUrl);
    if (videoId) {
      return {
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        hasExactVideo: true,
        isAutoCurated: false,
        nationalTourEmbed: `${NATIONAL_HERITAGE_TOUR_EMBED}?rel=0`,
      };
    }
  }

  // 2. Check if this monument matches any verified specific video in our dictionary
  const slug = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const matchKey = Object.keys(VERIFIED_MONUMENT_VIDEOS).find(
    (k) => slug === k || slug.includes(k) || k.includes(slug)
  );

  if (matchKey && VERIFIED_MONUMENT_VIDEOS[matchKey]) {
    const matched = VERIFIED_MONUMENT_VIDEOS[matchKey];
    return {
      embedUrl: `${matched.embed}?rel=0`,
      watchUrl: matched.watch,
      hasExactVideo: true,
      isAutoCurated: true,
      nationalTourEmbed: `${NATIONAL_HERITAGE_TOUR_EMBED}?rel=0`,
    };
  }

  // 3. If NO verified specific video exists for this monument, DO NOT embed a wrong monument's video!
  // Return null embedUrl and targeted search link
  return {
    embedUrl: null,
    watchUrl: searchWatchUrl,
    hasExactVideo: false,
    isAutoCurated: true,
    nationalTourEmbed: `${NATIONAL_HERITAGE_TOUR_EMBED}?rel=0`,
  };
}

/**
 * Generates a unique, high-aesthetic architectural SVG for any monument
 * containing its actual name, location, and period.
 * Ensures zero-confusion: no Taj Mahal or Konark Temple is ever shown for other sites!
 */
export function generateDynamicMonumentSvg(
  title: string,
  location?: string,
  period = 'Heritage',
  category = 'monument'
): string {
  const cleanTitle = (title || 'Bharat Heritage')
    .replace(/[&<>'"]/g, '')
    .trim()
    .toUpperCase();
  const cleanLoc = (location || 'National Archive')
    .replace(/[&<>'"]/g, '')
    .trim();
  const cleanPeriod = (period || 'Historic').replace(/[&<>'"]/g, '');

  // Select architectural motif based on category
  let motifPath = 'M350 330 L400 170 L450 330 Z M380 170 L400 110 L420 170 Z'; // Temple Shikhara
  let accentColor = '#c9a24a'; // Royal Gold

  const catLower = category.toLowerCase();
  if (catLower.includes('fort') || catLower.includes('palace')) {
    motifPath = 'M330 330 L330 200 L360 200 L360 220 L380 220 L380 200 L400 200 L400 220 L420 220 L420 200 L440 200 L440 220 L470 220 L470 330 Z'; // Fortress Battlement
    accentColor = '#e5a93c';
  } else if (catLower.includes('cave') || catLower.includes('rock')) {
    motifPath = 'M320 330 C320 210, 480 210, 480 330 Z M350 330 C350 240, 450 240, 450 330 Z'; // Rock Arch
    accentColor = '#d97706';
  } else if (catLower.includes('nature') || catLower.includes('lake') || catLower.includes('water')) {
    motifPath = 'M320 330 C360 250, 400 310, 440 260 C460 230, 480 330, 480 330 Z'; // Mountain/Water
    accentColor = '#10b981';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#14110f"/>
        <stop offset="50%" stop-color="#231512"/>
        <stop offset="100%" stop-color="#0c0a10"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#c9a24a"/>
        <stop offset="50%" stop-color="#f5d77f"/>
        <stop offset="100%" stop-color="#c9a24a"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="400" cy="220" r="120" fill="#e0231c" opacity="0.12"/>
    <circle cx="400" cy="220" r="85" fill="${accentColor}" opacity="0.08"/>
    <path d="${motifPath}" fill="${accentColor}" opacity="0.85"/>
    <circle cx="400" cy="105" r="5" fill="#ff5a3c"/>
    <text x="400" y="370" font-family="Georgia,serif" font-size="22" font-weight="bold" fill="url(#gold)" text-anchor="middle" letter-spacing="1">${cleanTitle}</text>
    <text x="400" y="400" font-family="sans-serif" font-size="12" font-weight="500" fill="#d1d5db" text-anchor="middle">${cleanLoc} · ${cleanPeriod} Era</text>
    <text x="400" y="430" font-family="monospace" font-size="10" font-weight="bold" fill="${accentColor}" text-anchor="middle" letter-spacing="2">AUTHENTIC LIVING HERITAGE ARCHIVE</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
