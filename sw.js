const CACHE_NAME = "qr-web-share-target";

const SAME_ORIGIN_RESOURCE = [
  "/qrcodegen",
  "/qrcodegen/index.html",
  "/qrcodegen/manifest.json",
  "/qrcodegen/sw.js",
  "/qrcodegen/qrcode.min.js",
  "/qrcodegen/favicon.ico",
  "/qrcodegen/images/android-chrome-192x192.png",
  "/qrcodegen/images/android-chrome-512x512.png",
  "/qrcodegen/images/apple-touch-icon.png",
  "/qrcodegen/images/favicon-16x16.png",
  "/qrcodegen/images/favicon-32x32.png",
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
          await cache.put(e.request.url, await resp);
        }, 0);

        return resp;
      }),
  );
});
