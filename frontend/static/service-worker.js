const CACHE_NAME = 'inventory-pos-cache-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/static/css/style.css',
    '/static/js/auth.js',
    '/static/js/products.js',
    // Agregar otros archivos estáticos
];

self.addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request)
            .then(res => res || fetch(fetchEvent.request))
    );
});