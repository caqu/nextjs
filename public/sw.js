self.addEventListener('install', function (event) {
    console.log("Hello world from the Service Worker 🤙");
    event.waitUntil(
        caches.open('sw-cache').then(function (cache) {
            return cache.add('/');
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});