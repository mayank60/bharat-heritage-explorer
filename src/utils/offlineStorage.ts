import { HeritageItem, State, MonumentPhoto } from '../types.ts';

const DB_NAME = 'BharatHeritageOfflineDB';
const DB_VERSION = 2;
const STORE_ITEMS = 'heritage_items';
const STORE_STATES = 'states';
const STORE_META = 'sync_meta';
const STORE_CONTRIBUTIONS = 'community_contributions';
const STORE_PHOTOS = 'monument_photos';
const STORE_OUTBOX = 'offline_outbox';

/**
 * Open or upgrade the IndexedDB database for offline heritage storage
 */
export function openHeritageDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported in this browser'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_ITEMS)) {
        db.createObjectStore(STORE_ITEMS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_STATES)) {
        db.createObjectStore(STORE_STATES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORE_CONTRIBUTIONS)) {
        db.createObjectStore(STORE_CONTRIBUTIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        const photoStore = db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
        photoStore.createIndex('monument_id', 'monument_id', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) {
        db.createObjectStore(STORE_OUTBOX, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Cache all monuments and state packages to IndexedDB for offline-first usage
 */
export async function cacheHeritageDataOffline(
  items: HeritageItem[],
  states: State[]
): Promise<{ success: boolean; itemCount: number; stateCount: number; timestamp: string }> {
  const timestamp = new Date().toISOString();
  try {
    const db = await openHeritageDB();
    const tx = db.transaction([STORE_ITEMS, STORE_STATES, STORE_META], 'readwrite');
    const itemsStore = tx.objectStore(STORE_ITEMS);
    const statesStore = tx.objectStore(STORE_STATES);
    const metaStore = tx.objectStore(STORE_META);

    // Clear old items and repopulate
    itemsStore.clear();
    statesStore.clear();

    for (const item of items) {
      itemsStore.put(item);
    }
    for (const state of states) {
      statesStore.put(state);
    }

    metaStore.put({
      key: 'sync_status',
      timestamp,
      itemCount: items.length,
      stateCount: states.length,
    });

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    return {
      success: true,
      itemCount: items.length,
      stateCount: states.length,
      timestamp,
    };
  } catch (err) {
    console.warn('IndexedDB caching failed, falling back to localStorage cache:', err);
    try {
      localStorage.setItem('bharat_offline_meta', JSON.stringify({ itemCount: items.length, timestamp }));
      return {
        success: true,
        itemCount: items.length,
        stateCount: states.length,
        timestamp,
      };
    } catch {
      return { success: false, itemCount: 0, stateCount: 0, timestamp };
    }
  }
}

/**
 * Retrieve cached monuments from IndexedDB if offline or on-demand
 */
export async function getCachedHeritageItems(): Promise<HeritageItem[] | null> {
  try {
    const db = await openHeritageDB();
    const tx = db.transaction([STORE_ITEMS], 'readonly');
    const store = tx.objectStore(STORE_ITEMS);
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results = request.result;
        resolve(Array.isArray(results) && results.length > 0 ? results : null);
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Check IndexedDB offline status & stats
 */
export async function getOfflineStorageInfo(): Promise<{
  isCached: boolean;
  itemCount: number;
  lastSynced: string | null;
}> {
  try {
    const db = await openHeritageDB();
    const tx = db.transaction([STORE_META, STORE_ITEMS], 'readonly');
    const metaStore = tx.objectStore(STORE_META);
    const itemsStore = tx.objectStore(STORE_ITEMS);

    const metaReq = metaStore.get('sync_status');
    const countReq = itemsStore.count();

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        const meta = metaReq.result;
        const count = countReq.result || 0;
        resolve({
          isCached: count > 0,
          itemCount: count,
          lastSynced: meta?.timestamp || null,
        });
      };
      tx.onerror = () => {
        resolve({ isCached: false, itemCount: 0, lastSynced: null });
      };
    });
  } catch {
    return { isCached: false, itemCount: 0, lastSynced: null };
  }
}

/**
 * Persist individual community contribution to IndexedDB
 */
export async function saveHeritageContributionOffline(item: HeritageItem): Promise<void> {
  try {
    const db = await openHeritageDB();
    const tx = db.transaction([STORE_CONTRIBUTIONS], 'readwrite');
    tx.objectStore(STORE_CONTRIBUTIONS).put(item);
  } catch (err) {
    console.warn('[OfflineDB] Could not save community item to IndexedDB:', err);
  }
}

/**
 * Retrieve all offline community contributions from IndexedDB
 */
export async function getOfflineCommunityContributions(): Promise<HeritageItem[]> {
  try {
    const db = await openHeritageDB();
    const tx = db.transaction([STORE_CONTRIBUTIONS], 'readonly');
    const store = tx.objectStore(STORE_CONTRIBUTIONS);
    const req = store.getAll();
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Persist uploaded monument photo to IndexedDB
 */
export async function saveMonumentPhotoOffline(photo: MonumentPhoto): Promise<void> {
  try {
    const db = await openHeritageDB();
    const tx = db.transaction([STORE_PHOTOS], 'readwrite');
    tx.objectStore(STORE_PHOTOS).put(photo);
  } catch (err) {
    console.warn('[OfflineDB] Could not save photo to IndexedDB:', err);
  }
}

/**
 * Retrieve monument photos from IndexedDB
 */
export async function getOfflineMonumentPhotos(monumentId: string): Promise<MonumentPhoto[]> {
  try {
    const db = await openHeritageDB();
    const tx = db.transaction([STORE_PHOTOS], 'readonly');
    const store = tx.objectStore(STORE_PHOTOS);
    const index = store.index('monument_id');
    const req = index.getAll(monumentId);
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Outbox persistence in IndexedDB
 */
export async function saveOutboxActionOffline(action: { id: string; type: string; payload: any; timestamp: number }): Promise<void> {
  try {
    const db = await openHeritageDB();
    const tx = db.transaction([STORE_OUTBOX], 'readwrite');
    tx.objectStore(STORE_OUTBOX).put(action);
  } catch (err) {
    console.warn('[OfflineDB] Could not save outbox action to IndexedDB:', err);
  }
}

export async function getOutboxActionsOffline(): Promise<any[]> {
  try {
    const db = await openHeritageDB();
    const tx = db.transaction([STORE_OUTBOX], 'readonly');
    const store = tx.objectStore(STORE_OUTBOX);
    const req = store.getAll();
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function removeOutboxActionOffline(id: string): Promise<void> {
  try {
    const db = await openHeritageDB();
    const tx = db.transaction([STORE_OUTBOX], 'readwrite');
    tx.objectStore(STORE_OUTBOX).delete(id);
  } catch (err) {
    console.warn('[OfflineDB] Could not remove outbox action from IndexedDB:', err);
  }
}

