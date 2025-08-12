const CACHE_NAME = "aria-navigator-v2"
const STATIC_CACHE = "aria-static-v2"
const DYNAMIC_CACHE = "aria-dynamic-v2"

// Recursos estáticos para cachear
const staticAssets = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/offline.html",
  "/_next/static/css/app/layout.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main.js",
]

// URLs que siempre deben ir a la red
const networkFirst = ["/api/gemini", "/api/"]

// URLs que pueden usar cache primero
const cacheFirst = ["/icon-", "/_next/static/", "/manifest.json"]

// Instalación del service worker con cache de recursos estáticos
self.addEventListener("install", (event) => {
  console.log("SW: Installing service worker")
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("SW: Caching static assets")
        return cache.addAll(staticAssets)
      })
      .then(() => {
        console.log("SW: Skip waiting")
        return self.skipWaiting()
      }),
  )
})

// Activación y limpieza de caches antiguos
self.addEventListener("activate", (event) => {
  console.log("SW: Activating service worker")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("SW: Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("SW: Claiming clients")
        return self.clients.claim()
      }),
  )
})

// Estrategia de fetch con diferentes políticas de cache
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Solo manejar requests del mismo origen
  if (url.origin !== location.origin) return

  // Network first para APIs
  if (networkFirst.some((path) => url.pathname.startsWith(path))) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Cache first para recursos estáticos
  if (cacheFirst.some((path) => url.pathname.includes(path))) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // Stale while revalidate para páginas
  event.respondWith(staleWhileRevalidateStrategy(request))
})

// Estrategia Network First
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("SW: Network failed, trying cache:", request.url)
    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // Fallback para páginas offline
    if (request.destination === "document") {
      return caches.match("/offline.html")
    }

    throw error
  }
}

// Estrategia Cache First
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("SW: Cache and network failed:", request.url)
    throw error
  }
}

// Estrategia Stale While Revalidate
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request)

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE)
        cache.then((c) => c.put(request, networkResponse.clone()))
      }
      return networkResponse
    })
    .catch(() => {
      // Si falla la red y no hay cache, mostrar página offline
      if (request.destination === "document" && !cachedResponse) {
        return caches.match("/offline.html")
      }
      throw new Error("Network failed and no cache available")
    })

  return cachedResponse || fetchPromise
}

// Manejo de mensajes del cliente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})

// Notificaciones push (preparado para futuro)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-72.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1,
      },
      actions: [
        {
          action: "explore",
          title: "Abrir ARIA",
          icon: "/icon-192.png",
        },
        {
          action: "close",
          title: "Cerrar",
          icon: "/icon-192.png",
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(data.title || "ARIA Navigator", options))
  }
})

// Manejo de clicks en notificaciones
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})
