const VERSION = 'wasmux-pwa-v1'

function getBasePath() {
  const scopeUrl = self.registration?.scope
  if (!scopeUrl) return '/wasmux/'
  const pathname = new URL(scopeUrl).pathname
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

const BASE_PATH = getBasePath()
const APP_SHELL_URLS = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.webmanifest`,
  `${BASE_PATH}icons/favicon.svg`,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(APP_SHELL_URLS)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))),
    ).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (!url.pathname.startsWith(BASE_PATH)) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone()
          caches.open(VERSION).then((cache) => cache.put(`${BASE_PATH}index.html`, responseClone))
          return response
        })
        .catch(async () => {
          const cache = await caches.open(VERSION)
          const cached = await cache.match(`${BASE_PATH}index.html`)
          return cached || Response.error()
        }),
    )
    return
  }

  const isStaticAsset =
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webmanifest')

  if (!isStaticAsset) return

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(VERSION).then((cache) => cache.put(request, responseClone))
        }
        return response
      })
    }),
  )
})
