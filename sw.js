/* Pixel Rounds service worker: network first, cached copy when offline.
 * Bump CACHE when you change the list of shell files. */
const CACHE = 'pixel-rounds-v1';
const SHELL = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/config.js',
  '/js/cases.js',
  '/js/cosmetics.js',
  '/js/avatar.js',
  '/js/state.js',
  '/js/main.js',
  '/fonts/press-start-2p.woff2',
  '/fonts/vt323.woff2',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.startsWith('/_vercel/')) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('/index.html') : undefined)))
  );
});
