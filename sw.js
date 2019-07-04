importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "ca4b494ad15368a5fb35f52eaf95a572"
  },
  {
    "url": "css/main.css",
    "revision": "0d787e0d2a9ec351f5dceb6790f59c83"
  },
  {
    "url": "js/install.js",
    "revision": "1711ea1c230c6ea7e24b06d9e9fdbdf4"
  },
  {
    "url": "js/main.js",
    "revision": "673bd3ea15f2f96b01fb3275434632c2"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "7d0d54e78bb066ac68de57b38e2206b2"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "f48ce20e60e9b4413f770dd65bf9dc93"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "377e9d48e5ee51bccf0c6b0bcdba48cd"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "2d598ab1c374337b47228773021a9ba9"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "9e8bf5f8c966dd1e051469e7b3be0741"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "dcf83bdaa77e5f07df73cb2b45bd0d61"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "1fa3613746b7af1c17a4df4946ed1ff6"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "01e6fa085aa737cfeca1b181af5a682b"
  },
  {
    "url": "images/try-again-later.jpg",
    "revision": "7b9aa47a4aa439044165dd9a1bef06b4"
  },
  {
    "url": "fallback-article.json",
    "revision": "86564680bb35fad6dbd627a7b27de1b0"
  },
  {
    "url": "favicon.ico",
    "revision": "b26ae5e8df9c7f9243209b9e4befd6da"
  }
]);

  // Route and handler for newsapi.org
  const newsapiHandler = workbox.strategies.networkFirst({
    cacheName: 'newsapi-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
      })
    ]
  });
  
  workbox.routing.registerRoute(/(.*)newsapi.org(.*)/, args => {
    return newsapiHandler.handle(args).then(response => {
      if (!response) {
        return caches.match('fallback-article.json');
      }
      return response;
    });
  });
  
  // Route and handler for images
  const imgHandler = workbox.strategies.networkFirst({
    cacheName: 'img-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
      })
    ]
  });
  
  workbox.routing.registerRoute(/^((?!(localhost|newsapi)).)*$/, args => {
    return imgHandler.handle(args);
  });

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
