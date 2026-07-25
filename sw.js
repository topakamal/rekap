const CACHE_NAME = 'rekap-pm-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch dari Jaringan (Bypass cache untuk data Google Sheets)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, gunakan cache (untuk HTML dan Manifest)
        if (response) {
          return response;
        }
        // Jika tidak ada di cache (seperti request ke Google Sheets), ambil dari internet
        return fetch(event.request);
      })
  );
});

