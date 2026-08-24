const CACHE_NAME = 'yoruosokumademiruyou-v1';
const urlsToCache = [
  '/yoruosokumademiruyou/',
  '/yoruosokumademiruyou/index.html',
  '/yoruosokumademiruyou/manifest.json'
];

// Service Worker インストール
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache).catch((error) => {
        console.warn('Cache addAll failed:', error);
        // キャッシュ失敗時も続行
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Service Worker アクティベート
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ネットワークリクエストのインターセプト
self.addEventListener('fetch', (event) => {
  // GETリクエストのみ処理
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュにあれば返す
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // ネットワークから取得できたらキャッシュに保存
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // ネットワークエラー時はキャッシュから取得、なければオフラインページ
        console.log('Fetch failed for:', event.request.url);
        return new Response('オフラインです。インターネット接続をご確認ください。', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain; charset=utf-8'
          })
        });
      });
    })
  );
});
