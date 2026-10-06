const CACHE_NAME = "payz-app-shell-v1";
const APP_SHELL_URL = new URL("./", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(new Request(APP_SHELL_URL, { cache: "reload" })))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("payz-app-shell-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  const appPath = new URL(self.registration.scope).pathname;
  const isAppNavigation =
    request.mode === "navigate" &&
    (url.pathname === appPath || url.pathname.startsWith(appPath));

  if (isAppNavigation) {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedShell = await caches.match(APP_SHELL_URL);
        return (
          cachedShell ??
          new Response("payz is offline. Reconnect and try again.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          })
        );
      }),
    );
    return;
  }

  if (/\.(?:css|js|svg|png|webp|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok && response.type === "basic") {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          throw new Error("No cached app asset is available.");
        }),
    );
  }
});
