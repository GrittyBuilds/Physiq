/* Physiq service worker.
   The app is one self-contained document, so "offline" only needs the shell
   plus the launcher icons.

   Strategy is deliberately split:
     - navigations go NETWORK FIRST, so a deploy is picked up on the next online
       load and no one is ever stuck on a stale build;
     - everything else same-origin goes CACHE FIRST and refreshes in the
       background, so a cold start is instant.
   Cross-origin requests (Supabase, Open Food Facts) are never touched. */
const CACHE = 'physiq-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './brand/png/web/icon-192.png',
  './brand/png/web/icon-512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html', { ignoreSearch: true })
          .then(hit => hit || caches.match('./')))
    );
    return;
  }

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const network = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || network;
    })
  );
});
