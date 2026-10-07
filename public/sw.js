/**
 * Bharat Heritage Explorer - Offline-First PWA Sanctuary Service Worker (sw.js)
 * High-performance offline caching, asset fallbacks, and instant boot without network
 */

const CACHE_VERSION = 'bharat-heritage-v4';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DATA_CACHE = `${CACHE_VERSION}-data`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Core App Shell essential assets
const CORE_PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/assets/images/monument_konark-sun-temple.jpg',
];

// Install: Precache App Shell + Discover Dynamic Asset Chunks
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      console.log('[ServiceWorker] Precaching core app shell & manifest...');
      try {
        await cache.addAll(CORE_PRECACHE_URLS);
      } catch (err) {
        console.warn('[ServiceWorker] Core precache partial error (non-fatal):', err);
      }

      // Automatically discover and precache built hashed JS/CSS assets from index.html
      try {
        const htmlResp = await fetch('/index.html');
        if (htmlResp.ok) {
          const htmlText = await htmlResp.text();
          const assetMatches = htmlText.match(/\/assets\/[a-zA-Z0-9_\-.]+\.(js|css)/g) || [];
          const uniqueAssets = [...new Set(assetMatches)];
          if (uniqueAssets.length > 0) {
            console.log('[ServiceWorker] Dynamically precaching application bundles:', uniqueAssets);
            await cache.addAll(uniqueAssets);
          }
        }
      } catch (assetErr) {
        console.warn('[ServiceWorker] Dynamic bundle precache skipped (offline install):', assetErr);
      }
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!key.startsWith(CACHE_VERSION)) {
            console.log('[ServiceWorker] Removing stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event Handler: Offline-First Resilient Strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and chrome-extension schemes
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // 1. Navigation requests (HTML Pages): Network-First with Instant Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          console.log('[ServiceWorker] Network offline, serving cached index.html');
          const cached = await caches.match('/index.html') || await caches.match('/');
          if (cached) return cached;
          return new Response(
            `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bharat Heritage Explorer - Offline</title><style>body{background:#121110;color:#ede8e1;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:20px;}</style></head><body><div><h1>📶 Bharat Heritage Sanctuary</h1><p>You are viewing cached offline mode. Reconnect to sync live community records.</p><button onclick="window.location.reload()" style="background:#b45309;color:#fff;border:none;padding:10px 20px;border-radius:12px;cursor:pointer;font-weight:bold;">Retry Connection</button></div></body></html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. API Data Requests (/api/*): Network-First with Data Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            console.log('[ServiceWorker] Returning cached API response for:', url.pathname);
            return cachedResponse;
          }
          return new Response(
            JSON.stringify({ success: false, message: 'Offline mode active. No cached data available.', offline: true }),
            { headers: { 'Content-Type': 'application/json' }, status: 503 }
          );
        })
    );
    return;
  }

  // 3. Static Assets (JS, CSS, Fonts): Stale-While-Revalidate
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. Image Assets (Unsplash, Local images, SVG): Cache-First with Stale-While-Revalidate
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico)$/i) ||
    url.hostname.includes('images.unsplash.com') ||
    url.hostname.includes('wikimedia.org')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(IMAGE_CACHE).then((cache) => cache.put(request, networkResponse));
              }
            })
            .catch(() => { /* offline revalidation ignored */ });
          return cachedResponse;
        }

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(IMAGE_CACHE).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(async () => {
            // Fallback to local monument photo on image load failure while offline
            return caches.match('/src/assets/images/monument_konark-sun-temple.jpg');
          });
      })
    );
    return;
  }

  // Default: Network with Cache Fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
