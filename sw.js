const staticAssets = [
  './',
  './index.html',
  './main.css',
  './main.js',
  './fallback-article.json',
  './images/install.svg',
  './images/refresh.svg',
  './images/try-again-later.jpg',
  './favicon.ico'
];

self.addEventListener('install', async event => {
  console.log('SW.JS install event');
  const cache = await caches.open('news-static');
  cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
  //console.log('SW.JS fetch event, url =', event.request.url);
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin == location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
})

async function cacheFirst(req) {
  //console.log('SW.JS cacheFirst function');
  const host = req.url.match('//.+?/')[0].replace(new RegExp('/', 'g'), '');
  const cachedResponse = await caches.match(req);

  if (cachedResponse) {
    console.log('   cacheFirst FROM   CACHE, host =', host);
    return cachedResponse;
  } else {
    console.log('   cacheFirst FROM NETWORK, host =', host);
    return fetch(req);
  }
}

async function networkFirst(req) {
  //console.log('SW.JS networkFirst function');
  const host = req.url.match('//.+?/')[0].replace(new RegExp('/', 'g'), '');
  const cache = await caches.open('news-dynamic');

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    console.log('networkFirst FROM NETWORK, host =', host);
    return res;
  } catch (error) {
    cachedResponse = await cache.match(req);
    console.log('networkFirst FROM   CACHE, host =', host);
    return cachedResponse || await caches.match('./fallback-article.json');
  }
}
