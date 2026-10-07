import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { HeritageItem, MonumentPhoto, AdminVisitorRecord } from '../types.ts';
import { sanitizeObject, sanitizeText, sanitizeImageUrl } from './security.ts';
import {
  saveHeritageContributionOffline,
  getOfflineCommunityContributions,
  saveMonumentPhotoOffline,
  getOfflineMonumentPhotos,
  saveOutboxActionOffline,
  getOutboxActionsOffline,
  removeOutboxActionOffline,
} from './offlineStorage.ts';

/**
 * Bharat Heritage Explorer - Real-Time Cloud Database Service
 * Multi-Tier Resilient Architecture:
 * 1. Supabase Cloud Database & Realtime Channels (When VITE_SUPABASE_URL is provided)
 * 2. Express Server API with Persistent Database (Universal Fallback)
 * 3. Client-side Realtime BroadcastChannel (Sub-millisecond Cross-Tab Synchronization)
 * 4. LocalStorage & IndexedDB Offline Fallback (Zero-Data Network Resilience)
 */

const SUPABASE_URL = (import.meta.env?.VITE_SUPABASE_URL as string) || '';
const SUPABASE_ANON_KEY = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || '';

let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http')) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    console.log('[CloudDB] Connected to Supabase Real-Time Client:', SUPABASE_URL);
  } catch (err) {
    console.warn('[CloudDB] Supabase initialization failed, falling back to server API:', err);
  }
}

// Cross-tab real-time sync channel
export const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('bharat_heritage_explorer_realtime')
  : null;

export function broadcastCrossTab(type: string, payload: any): void {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload });
    } catch {}
  }
}

// Event listeners registry
type Listener<T> = (data: T) => void;
const heritageListeners = new Set<Listener<HeritageItem[]>>();
const photoListeners = new Map<string, Set<Listener<MonumentPhoto[]>>>();
const visitorListeners = new Set<Listener<AdminVisitorRecord[]>>();

// Listen for broadcast channel updates
if (broadcastChannel) {
  broadcastChannel.onmessage = (event) => {
    const { type, payload } = event.data || {};
    if (type === 'COMMUNITY_HERITAGE_UPDATED' && Array.isArray(payload)) {
      heritageListeners.forEach((fn) => fn(payload));
    } else if (type === 'MONUMENT_PHOTOS_UPDATED' && payload?.monumentId && Array.isArray(payload?.photos)) {
      const set = photoListeners.get(payload.monumentId);
      if (set) {
        set.forEach((fn) => fn(payload.photos));
      }
    } else if (type === 'VISITORS_UPDATED' && Array.isArray(payload)) {
      visitorListeners.forEach((fn) => fn(payload));
    }
  };
}

// Multi-browser Cross-Tab Fallback via Storage Event (guarantees cross-tab sync in all browsers)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'bharat_community_sync' || e.key === 'bharat_community_contributions') {
      try {
        const updated = JSON.parse(localStorage.getItem('bharat_community_contributions') || '[]');
        heritageListeners.forEach((fn) => fn(updated));
      } catch { /* ignore */ }
    }
  });
}

/**
 * OFFLINE OUTBOX & AUTOMATIC RECONNECTION SYNC ENGINE
 * Preserves user submissions in localStorage/IndexedDB when offline and auto-syncs to Supabase on reconnection
 */
interface OfflineOutboxItem {
  id: string;
  type: 'add_heritage' | 'add_photo';
  payload: any;
  timestamp: number;
}

export function queueOfflineAction(type: OfflineOutboxItem['type'], payload: any): void {
  const item: OfflineOutboxItem = {
    id: `outbox_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    type,
    payload,
    timestamp: Date.now(),
  };

  try {
    const queue: OfflineOutboxItem[] = JSON.parse(localStorage.getItem('bhe_offline_outbox') || '[]');
    queue.push(item);
    localStorage.setItem('bhe_offline_outbox', JSON.stringify(queue));
    console.log(`[OfflineSanctuary] Saved action to offline outbox (${type})`);
  } catch { /* ignore */ }

  saveOutboxActionOffline(item).catch(() => {});
}

export async function flushOfflineOutbox(): Promise<number> {
  if (typeof window === 'undefined' || (typeof navigator !== 'undefined' && !navigator.onLine)) return 0;
  let queue: OfflineOutboxItem[] = [];
  try {
    queue = JSON.parse(localStorage.getItem('bhe_offline_outbox') || '[]');
  } catch { queue = []; }

  // Fallback to IndexedDB outbox if localStorage is empty
  if (queue.length === 0) {
    try {
      const idbQueue = await getOutboxActionsOffline();
      if (Array.isArray(idbQueue) && idbQueue.length > 0) {
        queue = idbQueue;
      }
    } catch {}
  }

  if (!queue || queue.length === 0) return 0;

  console.log(`[OfflineSanctuary] Network online! Flushing ${queue.length} offline mutations to cloud...`);
  const remaining: OfflineOutboxItem[] = [];
  let flushedCount = 0;

  for (const item of queue) {
    try {
      if (item.type === 'add_heritage') {
        if (supabase) {
          const { error } = await supabase.from('community_heritage').upsert([item.payload]);
          if (error) throw error;
        }
        await fetch('/api/heritage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        }).catch(() => {});
        flushedCount++;
        removeOutboxActionOffline(item.id).catch(() => {});
      } else if (item.type === 'add_photo') {
        if (supabase) {
          const { error } = await supabase.from('monument_photos').upsert([item.payload]);
          if (error) throw error;
        }
        await fetch(`/api/heritage/${encodeURIComponent(item.payload.monument_id)}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        }).catch(() => {});
        flushedCount++;
        removeOutboxActionOffline(item.id).catch(() => {});
      }
    } catch (err) {
      console.warn(`[OfflineSanctuary] Retaining outbox item ${item.id} for next sync retry:`, err);
      remaining.push(item);
    }
  }

  localStorage.setItem('bhe_offline_outbox', JSON.stringify(remaining));
  if (flushedCount > 0) {
    console.log(`[OfflineSanctuary] Flushed ${flushedCount} pending mutations to Supabase!`);
    fetchCommunityHeritage().then((fresh) => {
      heritageListeners.forEach((fn) => fn(fresh));
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'COMMUNITY_HERITAGE_UPDATED', payload: fresh });
      }
    });
  }
  return flushedCount;
}

// Automatically sync when network reconnects
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[OfflineSanctuary] Network connection restored! Auto-flushing offline queue...');
    flushOfflineOutbox();
  });
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    setTimeout(() => { flushOfflineOutbox(); }, 2500);
  }
}

// Setup Supabase Real-Time Subscriptions if connected
if (supabase) {
  try {
    supabase
      .channel('public:bharat_heritage')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_heritage' },
        async () => {
          const items = await fetchCommunityHeritage();
          heritageListeners.forEach((fn) => fn(items));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'monument_photos' },
        async (payload) => {
          const monumentId = (payload.new as any)?.monument_id || (payload.old as any)?.monument_id;
          if (monumentId) {
            const photos = await fetchMonumentPhotos(monumentId);
            const set = photoListeners.get(monumentId);
            if (set) set.forEach((fn) => fn(photos));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'active_visitors' },
        async () => {
          const visitors = await fetchSecureVisitorLogs();
          visitorListeners.forEach((fn) => fn(visitors));
        }
      )
      .subscribe();
  } catch (err) {
    console.warn('[CloudDB] Realtime subscription error:', err);
  }
}

// Background live-sync interval (every 10 seconds) for clients across devices/browsers
let lastSyncedHeritageHash = '';
if (typeof window !== 'undefined') {
  setInterval(async () => {
    if (heritageListeners.size === 0) return;
    try {
      const items = await fetchCommunityHeritage();
      if (Array.isArray(items)) {
        const currentHash = items.map((i) => i.id).join(',');
        if (lastSyncedHeritageHash && currentHash !== lastSyncedHeritageHash) {
          heritageListeners.forEach((fn) => fn(items));
        }
        lastSyncedHeritageHash = currentHash;
      }
    } catch {
      /* ignore */
    }
  }, 10000);
}

// Background live-sync interval (every 8 seconds) for active monument photo gallery viewers
const lastSyncedPhotosHashes = new Map<string, string>();
if (typeof window !== 'undefined') {
  setInterval(async () => {
    if (photoListeners.size === 0) return;
    for (const [monumentId, listeners] of photoListeners.entries()) {
      if (listeners.size === 0) continue;
      try {
        const photos = await fetchMonumentPhotos(monumentId);
        if (Array.isArray(photos)) {
          const currentHash = photos.map((p) => p.id).join(',');
          const lastHash = lastSyncedPhotosHashes.get(monumentId);
          if (lastHash && currentHash !== lastHash) {
            listeners.forEach((fn) => fn(photos));
          }
          lastSyncedPhotosHashes.set(monumentId, currentHash);
        }
      } catch {
        /* ignore */
      }
    }
  }, 8000);
}

/**
 * 1. COMMUNITY HERITAGE CRUD & REAL-TIME
 */
export async function fetchCommunityHeritage(): Promise<HeritageItem[]> {
  // A. Try Supabase first if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('community_heritage')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const items = data.map((r: any) => ({
          id: String(r.id),
          title: String(r.title),
          hindi_title: r.hindi_title ? String(r.hindi_title) : undefined,
          state_id: String(r.state_id),
          category_id: String(r.category_id || 'monuments'),
          period: (r.period || 'Medieval') as any,
          location_name: String(r.location_name || 'India'),
          summary: String(r.summary),
          history: String(r.history || r.summary),
          culture: String(r.culture || r.summary),
          image_url: sanitizeImageUrl(r.image_url),
          video_url: String(r.video_url || ''),
          timings: String(r.timings || 'Sunrise to Sunset'),
          best_time: String(r.best_time || 'October to March'),
          unesco_flag: Boolean(r.unesco_flag),
          is_community: true,
          created_at: String(r.created_at),
          lat: Number(r.lat) || 26.9124,
          lng: Number(r.lng) || 75.7873,
        }));
        // Cache locally for offline
        try {
          localStorage.setItem('bharat_community_contributions', JSON.stringify(items));
        } catch { /* ignore */ }
        return items;
      }
    } catch (err) {
      console.warn('[CloudDB] Supabase fetch error, falling back to server API:', err);
    }
  }

  // B. Fallback to Server API (/api/community-heritage)
  try {
    const res = await fetch('/api/community-heritage');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        try {
          localStorage.setItem('bharat_community_contributions', JSON.stringify(data.items));
        } catch { /* ignore */ }
        return data.items;
      }
    }
  } catch {
    // Offline or network error
  }

  // C. Fallback to LocalStorage & IndexedDB offline cache
  try {
    const cached = localStorage.getItem('bharat_community_contributions');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }

  try {
    const idbCached = await getOfflineCommunityContributions();
    if (Array.isArray(idbCached) && idbCached.length > 0) {
      return idbCached;
    }
  } catch { /* ignore */ }

  return [];
}

export async function addCommunityHeritage(
  rawItem: Omit<HeritageItem, 'id' | 'created_at'>
): Promise<HeritageItem> {
  const sanitized = sanitizeObject(rawItem);
  const id = `community_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const created_at = new Date().toISOString();

  const itemToSave: HeritageItem = {
    ...sanitized,
    id,
    created_at,
    is_community: true,
  };

  // 1. Supabase write
  let supabaseSuccess = false;
  if (supabase) {
    try {
      const { error } = await supabase.from('community_heritage').insert([
        {
          id: itemToSave.id,
          title: itemToSave.title,
          hindi_title: itemToSave.hindi_title || null,
          state_id: itemToSave.state_id,
          category_id: itemToSave.category_id,
          period: itemToSave.period,
          location_name: itemToSave.location_name,
          summary: itemToSave.summary,
          history: itemToSave.history,
          culture: itemToSave.culture,
          image_url: itemToSave.image_url,
          video_url: itemToSave.video_url || '',
          timings: itemToSave.timings,
          best_time: itemToSave.best_time,
          unesco_flag: itemToSave.unesco_flag,
          is_community: true,
          lat: itemToSave.lat,
          lng: itemToSave.lng,
          created_at: itemToSave.created_at,
        },
      ]);
      if (!error) supabaseSuccess = true;
    } catch (err) {
      console.warn('[CloudDB] Supabase insert warning:', err);
    }
  }

  // 2. Server API write
  let serverSuccess = false;
  try {
    const res = await fetch('/api/heritage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemToSave),
    });
    if (res.ok) serverSuccess = true;
  } catch (err) {
    console.warn('[CloudDB] Server API insert error (offline mode):', err);
  }

  // If cloud writes failed or device is offline, queue to outbox for auto-sync!
  if (!supabaseSuccess && !serverSuccess) {
    queueOfflineAction('add_heritage', itemToSave);
  }

  // 3. Update local cache (localStorage + IndexedDB)
  try {
    const existing = JSON.parse(localStorage.getItem('bharat_community_contributions') || '[]');
    const updated = [itemToSave, ...existing.filter((i: HeritageItem) => i.id !== id)];
    localStorage.setItem('bharat_community_contributions', JSON.stringify(updated));
    localStorage.setItem('bharat_community_sync', Date.now().toString());

    // Also persist to IndexedDB for high-capacity offline storage
    saveHeritageContributionOffline(itemToSave).catch(() => {});

    // Broadcast to other tabs & listeners
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'COMMUNITY_HERITAGE_UPDATED', payload: updated });
    }
    heritageListeners.forEach((fn) => fn(updated));
  } catch { /* ignore */ }

  return itemToSave;
}

export async function deleteCommunityHeritage(id: string, adminPasscode: string): Promise<boolean> {
  const cleanPasscode = sanitizeText(adminPasscode);
  let success = false;

  // 1. Try Supabase delete if connected
  if (supabase) {
    try {
      const { error } = await supabase.from('community_heritage').delete().eq('id', id);
      if (!error) success = true;
    } catch { /* ignore */ }
  }

  // 2. Server API delete
  try {
    const res = await fetch(`/api/heritage/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: cleanPasscode }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) success = true;
    }
  } catch { /* ignore */ }

  // 3. Remove from local cache
  try {
    const existing = JSON.parse(localStorage.getItem('bharat_community_contributions') || '[]');
    const updated = existing.filter((i: HeritageItem) => i.id !== id);
    localStorage.setItem('bharat_community_contributions', JSON.stringify(updated));

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'COMMUNITY_HERITAGE_UPDATED', payload: updated });
    }
    heritageListeners.forEach((fn) => fn(updated));
    success = true;
  } catch { /* ignore */ }

  return success;
}

export function subscribeToCommunityHeritage(listener: Listener<HeritageItem[]>): () => void {
  heritageListeners.add(listener);
  return () => heritageListeners.delete(listener);
}

/**
 * 2. MONUMENT PHOTO GALLERY (Crowdsourced Photo Contribution)
 */
export async function fetchMonumentPhotos(monumentId: string): Promise<MonumentPhoto[]> {
  const cleanId = sanitizeText(monumentId);
  const cacheKey = `monument_photos_${cleanId}`;

  // A. Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('monument_photos')
        .select('*')
        .eq('monument_id', cleanId)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const photos: MonumentPhoto[] = data.map((p) => ({
          id: String(p.id),
          monument_id: String(p.monument_id),
          image_url: sanitizeImageUrl(p.image_url),
          caption: p.caption ? sanitizeText(p.caption) : undefined,
          contributor_name: sanitizeText(p.contributor_name || 'Heritage Explorer'),
          created_at: String(p.created_at),
          verified: Boolean(p.verified ?? true),
        }));
        try {
          localStorage.setItem(cacheKey, JSON.stringify(photos));
        } catch { /* ignore */ }
        return photos;
      }
    } catch { /* ignore */ }
  }

  // B. Server API
  try {
    const res = await fetch(`/api/heritage/${encodeURIComponent(cleanId)}/photos`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.photos)) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data.photos));
        } catch { /* ignore */ }
        return data.photos;
      }
    }
  } catch { /* ignore */ }

  // C. Local Cache & IndexedDB Fallback
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }

  try {
    const idbCached = await getOfflineMonumentPhotos(cleanId);
    if (Array.isArray(idbCached) && idbCached.length > 0) {
      return idbCached;
    }
  } catch { /* ignore */ }

  return [];
}

export async function addMonumentPhoto(params: {
  monument_id: string;
  image_url: string;
  caption?: string;
  contributor_name?: string;
}): Promise<MonumentPhoto> {
  const cleanMonumentId = sanitizeText(params.monument_id);
  const cleanImageUrl = sanitizeImageUrl(params.image_url);
  const cleanCaption = params.caption ? sanitizeText(params.caption) : '';
  const cleanContributor = sanitizeText(params.contributor_name || 'Heritage Explorer');
  const id = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const created_at = new Date().toISOString();

  const photo: MonumentPhoto = {
    id,
    monument_id: cleanMonumentId,
    image_url: cleanImageUrl,
    caption: cleanCaption || undefined,
    contributor_name: cleanContributor,
    created_at,
    verified: true,
  };

  // 1. Supabase insert
  let supabaseSuccess = false;
  if (supabase) {
    try {
      const { error } = await supabase.from('monument_photos').insert([
        {
          id: photo.id,
          monument_id: photo.monument_id,
          image_url: photo.image_url,
          caption: photo.caption || null,
          contributor_name: photo.contributor_name,
          created_at: photo.created_at,
          verified: true,
        },
      ]);
      if (!error) supabaseSuccess = true;
    } catch (err) {
      console.warn('[CloudDB] Supabase photo insert error:', err);
    }
  }

  // 2. Server API insert
  let serverSuccess = false;
  try {
    const res = await fetch(`/api/heritage/${encodeURIComponent(cleanMonumentId)}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photo),
    });
    if (res.ok) serverSuccess = true;
  } catch (err) {
    console.warn('[CloudDB] Server photo API insert error:', err);
  }

  // If cloud targets failed or offline, queue to outbox!
  if (!supabaseSuccess && !serverSuccess) {
    queueOfflineAction('add_photo', photo);
  }

  // 3. Update local cache & broadcast (localStorage + IndexedDB)
  try {
    const cacheKey = `monument_photos_${cleanMonumentId}`;
    const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]');
    const updated = [photo, ...existing.filter((p: MonumentPhoto) => p.id !== id)];
    localStorage.setItem(cacheKey, JSON.stringify(updated));

    // Also persist to IndexedDB
    saveMonumentPhotoOffline(photo).catch(() => {});

    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'MONUMENT_PHOTOS_UPDATED',
        payload: { monumentId: cleanMonumentId, photos: updated },
      });
    }

    const listeners = photoListeners.get(cleanMonumentId);
    if (listeners) {
      listeners.forEach((fn) => fn(updated));
    }
  } catch { /* ignore */ }

  return photo;
}

export async function deleteMonumentPhoto(
  photoId: string,
  monumentId: string,
  adminPasscode: string
): Promise<boolean> {
  const cleanPhotoId = sanitizeText(photoId);
  const cleanMonumentId = sanitizeText(monumentId);
  const cleanPasscode = sanitizeText(adminPasscode);
  let success = false;

  if (supabase) {
    try {
      const { error } = await supabase.from('monument_photos').delete().eq('id', cleanPhotoId);
      if (!error) success = true;
    } catch { /* ignore */ }
  }

  try {
    const res = await fetch(
      `/api/heritage/${encodeURIComponent(cleanMonumentId)}/photos/${encodeURIComponent(cleanPhotoId)}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: cleanPasscode }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.success) success = true;
    }
  } catch { /* ignore */ }

  try {
    const cacheKey = `monument_photos_${cleanMonumentId}`;
    const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]');
    const updated = existing.filter((p: MonumentPhoto) => p.id !== cleanPhotoId);
    localStorage.setItem(cacheKey, JSON.stringify(updated));

    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'MONUMENT_PHOTOS_UPDATED',
        payload: { monumentId: cleanMonumentId, photos: updated },
      });
    }

    const listeners = photoListeners.get(cleanMonumentId);
    if (listeners) {
      listeners.forEach((fn) => fn(updated));
    }
    success = true;
  } catch { /* ignore */ }

  return success;
}

export function subscribeToMonumentPhotos(
  monumentId: string,
  listener: Listener<MonumentPhoto[]>
): () => void {
  if (!photoListeners.has(monumentId)) {
    photoListeners.set(monumentId, new Set());
  }
  photoListeners.get(monumentId)!.add(listener);

  return () => {
    const set = photoListeners.get(monumentId);
    if (set) {
      set.delete(listener);
      if (set.size === 0) photoListeners.delete(monumentId);
    }
  };
}

/**
 * 3. VISITOR REGISTRATION & SECURE AUDIT LOGGING
 */
export async function registerVisitorSession(params: {
  passId: string;
  name: string;
  role?: string;
  platform?: string;
}): Promise<void> {
  const cleanPassId = sanitizeText(params.passId);
  const cleanName = sanitizeText(params.name);
  const cleanRole = sanitizeText(params.role || 'Cultural Heritage Explorer');
  const cleanPlatform = sanitizeText(params.platform || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Device')).slice(0, 150);
  const nowIso = new Date().toISOString();

  // 1. Supabase Cloud Sync (Immediate global multi-device persist)
  if (supabase) {
    try {
      await supabase.from('active_visitors').upsert([
        {
          passid: cleanPassId,
          name: cleanName,
          role: cleanRole,
          platform: cleanPlatform,
          logintime: nowIso,
          lastactive: nowIso,
        },
      ]);
    } catch (err) {
      console.warn('[CloudDB] Supabase visitor register error:', err);
    }
  }

  // 2. Server API fallback / local sync
  try {
    await fetch('/api/visitors/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passId: cleanPassId,
        name: cleanName,
        role: cleanRole,
        platform: cleanPlatform,
      }),
    });
  } catch { /* ignore */ }

  // 3. Cross-tab Broadcast
  if (broadcastChannel) {
    broadcastChannel.postMessage({
      type: 'VISITORS_UPDATED',
      payload: { passId: cleanPassId, name: cleanName, role: cleanRole, platform: cleanPlatform },
    });
  }
}

export async function fetchSecureVisitorLogs(): Promise<AdminVisitorRecord[]> {
  const recordsMap = new Map<string, AdminVisitorRecord>();
  const nowMs = Date.now();

  // A. Fetch from Supabase Cloud (Live cross-device visitors globally)
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('active_visitors')
        .select('*')
        .order('lastactive', { ascending: false })
        .limit(100);

      if (!error && Array.isArray(data)) {
        data.forEach((r: any) => {
          const rawTime = r.lastactive || r.logintime;
          const timeMs = rawTime ? new Date(rawTime).getTime() : 0;
          const isLive = !isNaN(timeMs) && (nowMs - timeMs) < 15 * 60 * 1000; // active in last 15 min

          let formattedTime = 'Recently';
          try {
            if (rawTime) {
              formattedTime = new Date(rawTime).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
            }
          } catch {}

          const passId = String(r.passid || r.id);
          const rec: AdminVisitorRecord = {
            id: passId,
            passId,
            name: String(r.name),
            role: String(r.role || 'Cultural Heritage Explorer'),
            platform: String(r.platform || 'Web Device'),
            login_time: formattedTime,
            lastActive: String(rawTime || ''),
            isLive,
          };
          recordsMap.set(passId, rec);
        });
      }
    } catch (err) {
      console.warn('[CloudDB] Supabase visitor fetch error:', err);
    }
  }

  // B. Merge with Server API if available
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        data.users.forEach((u: any) => {
          const passId = String(u.passId || u.id);
          if (!recordsMap.has(passId)) {
            recordsMap.set(passId, u);
          }
        });
      }
    }
  } catch { /* ignore */ }

  return Array.from(recordsMap.values());
}

export function subscribeToVisitors(listener: Listener<AdminVisitorRecord[]>): () => void {
  visitorListeners.add(listener);
  fetchSecureVisitorLogs().then((logs) => listener(logs));
  return () => {
    visitorListeners.delete(listener);
  };
}

/**
 * 4. SAVED ITINERARY / BOOKMARK CLOUD SYNC
 */
export async function syncSavedItem(itemId: string, isSaved: boolean, sessionId?: string): Promise<void> {
  const cleanItemId = sanitizeText(itemId);
  const cleanSessionId = sanitizeText(sessionId || 'guest_explorer');
  if (supabase) {
    try {
      if (isSaved) {
        await supabase.from('saved_items').upsert([
          {
            id: `save_${cleanItemId}_${cleanSessionId}`,
            item_id: cleanItemId,
            user_session_id: cleanSessionId,
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        await supabase.from('saved_items').delete().eq('id', `save_${cleanItemId}_${cleanSessionId}`);
      }
    } catch (err) {
      console.warn('[CloudDB] Supabase saved_items sync error:', err);
    }
  }
}
