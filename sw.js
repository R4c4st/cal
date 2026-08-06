// Service worker — Plan Annotator (OCI Connect)
// Cache l'app pour un fonctionnement hors-ligne après la première visite.
const CACHE = 'plan-annotator-v2';

// Ressources locales à mettre en cache (chemins relatifs au scope du SW).
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Stratégie : cache d'abord, réseau en secours, index.html en dernier recours.
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached || fetch(e.request).catch(() => caches.match('./index.html'))
    )
  );
});
