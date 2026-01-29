const CACHE_VERSION = 'v1';
const CACHE_NAME = 'diamond-sutra-cache-v1';
const RUNTIME_CACHE = 'runtime, network-first';
const NETWORK_CACHE = 'network-first';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  self.clientsClaim();
});

self.addEventListener('activate', (event) => {
  self.clientsClaim();
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    await clearAllCaches();
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  for (const cacheName of cacheNames) {
    await caches.delete(cacheName);
  }
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((fetchResponse) => {
          return cache.put(event.request, fetchResponse.clone()).then(() => fetchResponse);
        });
      });
    }).catch((error) => {
      return fetch(event.request);
    });
  });

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
});

console.log('[Service Worker] Loaded');
