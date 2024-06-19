const CACHE_NAME = "qr-web-share-target";

const SAME_ORIGIN_RESOURCE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/sw.js",
  "/qrcode.min.js",
  "/favicon.ico",
  "/images/android-chrome-192x192.png",
  "/images/android-chrome-512x512.png",
  "/images/apple-touch-icon.png",
  "/images/favicon-16x16.png",
  "/images/favicon-32x32.png",
];

const CROSS_ORIGIN_RESOURCE = [
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
];

self.addEventListener("install", (e) => {
  const installing = async () => {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll([
      ...SAME_ORIGIN_RESOURCE,
      ...CROSS_ORIGIN_RESOURCE.map((url) => new Request(url, { mode: "cors" })),
    ]);
  };

  e.waitUntil(installing());
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches
      .match(e.request.url, { ignoreSearch: true })
      .then(async (response) => {
        if (response) return response;

        const resp = fetch(e.request.url, { mode: "cors" });

        setTimeout(async () => {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(e.request.url, resp);
        }, 0);

        return response;
      }),
  );
});
