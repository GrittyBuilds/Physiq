/* Physiq service worker.
   The app is one self-contained document, so "offline" only needs the shell
   plus the launcher icons.

   Strategy is deliberately split:
     - navigations go NETWORK FIRST, so a deploy is picked up on the next online
       load and no one is ever stuck on a stale build;
     - the shell assets go CACHE FIRST and refresh in the background, so a cold
       start is instant.
   Only successful responses are ever written to the cache, and cross-origin
   requests (Supabase, Open Food Facts) are never touched. */
const CACHE = 'physiq-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './brand/png/web/icon-192.png',
  './brand/png/web/icon-512.png'
];

/* Cache.addAll is atomic: one missing entry and nothing is stored at all.
   Warm each entry on its own so a single 404 can't disable offline support. */
async function warm() {
  const cache = await caches.open(CACHE);
  await Promise.all(SHELL.map(async url => {
    try {
      const res = await fetch(url, { cache: 'reload' });
      if (res && res.ok) await cache.put(url, res);
    } catch (e) { /* offline at install time; the fetch handler fills in later */ }
  }));
}

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(warm());
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
          /* Never let a 404 or a captive-portal page overwrite the shell. */
          if (res && res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html').then(hit => hit || caches.match('./')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => {
      const network = fetch(req).then(res => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || network;
    })
  );
});
