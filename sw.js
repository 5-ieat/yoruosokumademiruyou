// Service Worker for PWA
const CACHE_NAME = 'yoruosokumademiruyou-v1';
const ASSETS_TO_CACHE = [
  '/yoruosokumademiruyou/',
  '/yoruosokumademiruyou/index.html',
  '/yoruosokumademiruyou/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.error('Error caching assets:', err);
        // Continue even if some assets fail to cache
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response if available
      if (response) {
        return response;
      }

      // Try to fetch from network
      return fetch(event.request)
        .then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return cached response as fallback, or a custom offline page
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Optionally return a custom offline response
              return new Response(
                'オフラインです。インターネット接続を確認してください。',
                { status: 503, statusText: 'Service Unavailable' }
              );
            });
        });
    })
  );
});

// Handle background sync (optional)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Sync logic here
      Promise.resolve()
    );
  }
});
