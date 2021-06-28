const version = 1
const cacheName = `workbox-dogs${1}`

// import workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')
importScripts('./asset-manifest.js')

const { routing, strategies, precaching } = workbox

precaching.precacheAndRoute(
  manifest.map((url) => ({
    url,
    // file itself has its own revision
    revision: null,
  })),
  { cacheName }
)

// implements staleWhileRevalidate to all routes
routing.registerRoute(() => true, new strategies.StaleWhileRevalidate({ cacheName }))

// removes all caches not named <cacheName>
const invalidateOldCache = async () => {
  const keys = await caches.keys()
  const isOldCache = (key) => key !== cacheName
  const oldKeys = keys.filter(isOldCache)

  return Promise.all(oldKeys.map((key) => caches.delete(key)))
}

// runs invalidateOldCache on activation
self.addEventListener('activate', (e) => e.waitUntil(invalidateOldCache()))
