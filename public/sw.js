const CACHE_NAME = "asac-verifier-cache-v3"
const ASSETS_TO_CACHE = [
  "/",
  "/asac_icon_192.png",
  "/asac_icon_512.png",
  "/favicon.ico",
]

// Install event: cache basic assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event: network first, then cache fallback
self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return

  // Avoid caching API requests or non-http protocols (e.g. chrome-extension)
  const url = new URL(event.request.url)
  if (url.pathname.startsWith("/api") || !url.protocol.startsWith("http")) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid response, clone and cache it dynamically for static assets
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Fallback to cache on error
        return caches.match(event.request)
      })
  )
})
