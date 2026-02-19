const CACHE_NAME = 'brewery-v1';
const ASSETS = ['./', './index.html', './index.css', './app.js', './manifest.json', './icon-192.svg', './icon-512.svg'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).then(res => {
            if (res.ok && e.request.url.startsWith(self.location.origin)) {
                const clone = res.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
            }
            return res;
        }).catch(() => caches.match(e.request).then(c => c || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)))
    );
});
