const CACHE_NAME = 'rekap-pm-v2'; // Versi cache dinaikkan ke v2
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Install & Paksa versi baru untuk langsung aktif
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Hapus cache versi lama secara otomatis
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategi: Network First (Utamakan Internet, jika gagal baru pakai Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Jika online dan sukses, simpan pembaruan ke cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Jika offline (tidak ada sinyal), ambil data terakhir dari cache
        return caches.match(event.request);
      })
  );
});
