const CACHE_NAME = 'jrt-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
  // 外部フォントやChart.jsはCDNなので、ここではキャッシュ対象外としています
  // 完全オフラインを目指すなら、Chart.jsなどもローカルにDLしてここに記述します
];

// インストール時：キャッシュする
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// 起動時：キャッシュから返す
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});

// 更新時：古いキャッシュを消す
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});