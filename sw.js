// نسخة رمضان 1448 — غيّري اسم CACHE كل ما تنشري تحديث كبير
const CACHE = 'ramadan-1448-v1';
const FILES = ['./', './index.html', './manifest.json', './icon-512.png', './logo.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {})))));
  self.skipWaiting();
});

// يمسح أي كاش قديم (من السنة اللي فاتت) ويستلم الصفحات المفتوحة
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// شبكة أولاً (مع تجاوز كاش المتصفح)، والكاش للأوفلاين بس
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, {cache: 'no-cache'})
      .then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request))
  );
});
