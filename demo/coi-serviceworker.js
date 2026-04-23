/* coi-serviceworker - github.com/gzuidhof/coi-serviceworker (MIT)
 * Modified: uses COEP: credentialless instead of require-corp so that
 * cross-origin CDN resources (e.g. pygame-web.github.io) load without
 * needing a Cross-Origin-Resource-Policy header on the CDN side.
 * COOP: same-origin + COEP: credentialless still satisfies crossOriginIsolated.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", function (event) {
  if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        if (response.status === 0) return response;
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
        newHeaders.set("Cross-Origin-Embedder-Policy", "credentialless");
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      })
      .catch((e) => console.error(e))
  );
});
