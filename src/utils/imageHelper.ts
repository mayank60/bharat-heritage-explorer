// Universal Heritage Image Resolution & Resilient Fallback Utility

const ONLINE_FALLBACKS: Record<string, string> = {
  'amber-fort': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
  'hawa-mahal': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80',
  'taj-mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
  'golden-temple': 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80',
  'qutub-minar': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
  'red-fort': 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1000&q=80',
  'india-gate': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
  'konark-sun-temple': 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1000&q=80',
  'meenakshi-temple': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
  'brihadisvara-temple': 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1000&q=80',
  'victoria-memorial': 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1000&q=80',
  'gateway-of-india': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
  'charminar': 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=1000&q=80',
  'hampi': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
  'khajuraho': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80',
  'ajanta-ellora': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80',
  'mysore-palace': 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1000&q=80',
  'sanchi-stupa': 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=1000&q=80',
  'fatehpur-sikri': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
  'rani-ki-vav': 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1000&q=80',
  'jaisalmer-fort': 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1000&q=80',
};

import { generateDynamicMonumentSvg } from './authenticMediaHelper.ts';

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  temples: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
  forts: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
  festivals: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=1000&q=80',
  traditions: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1000&q=80',
  crafts: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1000&q=80',
  languages: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
  food: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80',
};

// Bulletproof SVG data URI that renders 100% offline even without internet access
export const OFFLINE_SVG_HERITAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23181412'/%3E%3Cstop offset='60%25' stop-color='%232a130f'/%3E%3Cstop offset='100%25' stop-color='%230f0d14'/%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Ccircle cx='400' cy='210' r='110' fill='%23e0231c' opacity='0.18'/%3E%3Cpath d='M350 330 L400 170 L450 330 Z M380 170 L400 110 L420 170 Z' fill='%23c9a24a' opacity='0.85'/%3E%3Ccircle cx='400' cy='105' r='6' fill='%23ff5a3c'/%3E%3Ctext x='400' y='375' font-family='Georgia,serif' font-size='22' font-weight='bold' fill='%23FAF8F5' text-anchor='middle'%3EBHARAT HERITAGE%3C/text%3E%3Ctext x='400' y='405' font-family='sans-serif' font-size='12' font-weight='500' fill='%23c9a24a' text-anchor='middle'%3ENational Living Cultural Archive%3C/text%3E%3C/svg%3E";

/**
 * Normalizes image URLs for local file:// protocol vs web server http://
 */
export function getHeritageImageUrl(url?: string, itemId?: string, categoryId?: string, title?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '' || url === 'undefined' || url === 'null') {
    return getFallbackImage(itemId, categoryId, title);
  }

  // Handle local file:// protocol on Windows/Mac
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    if (url.startsWith('/') && !url.startsWith('//')) {
      return '.' + url; // Convert /... to ./... so it resolves relative to standalone.html
    }
  }

  return url;
}

/**
 * Returns a high-res curated online fallback image, matching specific monuments or categories,
 * or generates a custom dynamic architectural SVG for that monument instead of hardcoding Taj Mahal.
 */
export function getFallbackImage(itemId?: string, categoryId?: string, title?: string): string {
  if (itemId) {
    const lowerId = itemId.toLowerCase();
    for (const [key, fallback] of Object.entries(ONLINE_FALLBACKS)) {
      if (lowerId.includes(key)) {
        return fallback;
      }
    }
  }

  if (categoryId && CATEGORY_DEFAULT_IMAGES[categoryId]) {
    return CATEGORY_DEFAULT_IMAGES[categoryId];
  }

  // Generate a personalized cultural SVG specific to this monument name
  const monumentTitle = title || (itemId ? itemId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Bharat Heritage');
  return generateDynamicMonumentSvg(monumentTitle, undefined, 'Living Archive', categoryId);
}

/**
 * Handles image load errors gracefully with tiered fallbacks (Local -> High-Res Online CDN -> Vector SVG)
 */
export function handleHeritageImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  itemId?: string,
  categoryId?: string
) {
  const img = e.currentTarget;
  const currentSrc = img.src;

  // Level 1: If it was a local file:// path that failed, try relative path
  if (typeof window !== 'undefined' && window.location.protocol === 'file:' && currentSrc.includes('/src/assets/')) {
    const parts = currentSrc.split('/src/assets/');
    if (parts.length > 1) {
      const relPath = './src/assets/' + parts[1];
      if (img.getAttribute('data-tried-rel') !== 'true') {
        img.setAttribute('data-tried-rel', 'true');
        img.src = relPath;
        return;
      }
    }
  }

  // Level 1b: If /src/assets/images/ failed on server, try /assets/images/
  if (currentSrc.includes('/src/assets/images/')) {
    const filename = currentSrc.split('/src/assets/images/')[1];
    if (filename && img.getAttribute('data-tried-root-asset') !== 'true') {
      img.setAttribute('data-tried-root-asset', 'true');
      img.src = '/assets/images/' + filename;
      return;
    }
  }

  // Level 1c: If /assets/images/ failed on server, try /src/assets/images/
  if (currentSrc.includes('/assets/images/') && !currentSrc.includes('/src/assets/images/')) {
    const filename = currentSrc.split('/assets/images/')[1];
    if (filename && img.getAttribute('data-tried-src-asset') !== 'true') {
      img.setAttribute('data-tried-src-asset', 'true');
      img.src = '/src/assets/images/' + filename;
      return;
    }
  }

  // Level 2: Try curated high-res CDN fallback
  if (img.getAttribute('data-tried-cdn') !== 'true') {
    img.setAttribute('data-tried-cdn', 'true');
    img.src = getFallbackImage(itemId, categoryId);
    return;
  }

  // Level 3: Permanent SVG fallback (100% reliable, zero network required)
  if (img.getAttribute('data-tried-svg') === 'true') {
    return;
  }
  img.setAttribute('data-tried-svg', 'true');
  img.onerror = null;
  const monumentTitle = itemId ? itemId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Bharat Heritage';
  img.src = generateDynamicMonumentSvg(monumentTitle, undefined, 'Heritage Site', categoryId);
}
