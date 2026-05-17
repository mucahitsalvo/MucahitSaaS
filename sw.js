const CACHE_NAME = 'muhasebe-premium-bypass-cache';

self.addEventListener('install', event => {
  // Install immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete ALL previous caches to break the loop
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // ALWAYS fetch from network directly, bypass cache
  event.respondWith(fetch(event.request));
});
