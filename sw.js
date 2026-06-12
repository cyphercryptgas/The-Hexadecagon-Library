const CACHE = "hexlib-shell-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.mode === "navigate") {
    // network first: a fresh deploy always wins; cache is only the offline fallback
    e.respondWith(
      fetch(r).then((res) => {
        const cp = res.clone();
        caches.open(CACHE).then((c) => c.put("/", cp));
        return res;
      }).catch(() => caches.match("/"))
    );
  }
});
