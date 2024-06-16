const addResourcesToCache = async (resources) => {
  const cache = await caches.open("my-cache");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/index.html",
      "/assets/index.css",
      "/static/bear.png",
      "/static/chicken.png",
      "/static/dog.png",
      "/static/giraffe.png",
      "/static/meerkat.png",
      "/static/panda.png",
    ])
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
