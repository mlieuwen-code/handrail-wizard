// Keeps a copy of the app on the phone so it opens with no signal; refreshes it in the background when there is signal.
const CACHE = 'handrail-2026.11.20-b2ef1a';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'ra-dark.png', 'ra-light.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).pathname.endsWith('/version.json')) return;   // always ask GitHub for the current version
  if (req.mode === 'navigate') {
    e.respondWith(caches.open(CACHE).then(c => c.match('index.html').then(hit => {
      const net = fetch(req.url, { cache: 'no-cache' }).then(r => { if (r.ok) c.put('index.html', r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }
  e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }))));
});
