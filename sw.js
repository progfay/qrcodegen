self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('video-store').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/sw.js',
        '/qrcode.min.js',
        '/favicon.ico',
        '/images/android-chrome-192x192.png',
        '/images/android-chrome-512x512.png',
        '/images/apple-touch-icon.png',
        '/images/favicon-16x16.png',
        '/images/favicon-32x32.png'
      ])
    })
  )
})

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request)
    })
  )
})
