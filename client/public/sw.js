const CACHE_NAME = 'msec-erp-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico'
];

// Install: Cache static shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting()) // Activate immediately
    );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim()) // Take control of all open tabs
    );
});

// Fetch: Network-first for API, Stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle http/https requests (skip chrome-extension://, etc.)
    if (!url.protocol.startsWith('http')) return;

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // API calls: Always network-first (never serve stale API data)
    if (url.pathname.startsWith('/api')) {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return caches.match(request);
                })
        );
        return;
    }

    // Static assets & pages: Stale-while-revalidate
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        })
    );
});
