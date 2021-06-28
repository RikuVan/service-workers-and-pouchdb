importScripts('./asset-manifest.js')
const version = 3
const cacheName = `dogs-${version}`

const fetchOptions = {
  method: 'GET',
  credentials: 'omit',
  cache: 'no-cache',
}

const breadListApi = 'https://dog.ceo/api/breeds/list'
const routes = ['/', '/dog-friends']

self.addEventListener('install', onInstall)
self.addEventListener('activate', onActivate)
self.addEventListener('fetch', onFetch)

async function onInstall(evt) {
  // warm the cache with all our assets
  evt.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(manifest))
      .then(() => {
        // otherwise new SW requires page change/refresh
        self.skipWaiting()
      })
  )
}

function onActivate(evt) {
  // waitUntil ensure everything gets done
  evt.waitUntil(handleActivation())
}

function onFetch(evt) {
  const url = evt.request.url
  // dog-friends is pouchdb - handles its own syncing
  if (evt.request.method !== 'GET' || url.includes('dog-friends')) return
  if (url.includes('api')) {
    if (url.includes('image')) {
      // we don't want to keep caching random images
      return fromCacheOrFetch(evt)
    } else {
      return staleWithRevalidate(evt)
    }
  }
  if (url.includes('assets')) {
    return fromCacheOrFetch(evt)
  }
  return staleWithRevalidate(evt)
}

async function handleActivation() {
  await clearCaches()
  await cacheImages()
  // tell all clients SW is in control
  await clients.claim()
}

function staleWithRevalidate(evt) {
  const cached = caches.match(evt.request.url)
  const fetched = fetch(evt.request)
  const fetchedCopy = fetched.then((res) => res.clone())

  // Call respondWith() with whatever we get first.
  // If the fetch fails (e.g disconnected), wait for the cache.
  // If there’s nothing in cache, wait for the fetch.
  // If neither yields a response, return a 404.
  evt.respondWith(
    Promise.race([fetched.catch((_) => cached), cached])
      .then((resp) => resp || fetched)
      .catch((_) => new Response(null, { status: 404 }))
  )

  // Update the cache with the version we fetched
  evt.waitUntil(
    Promise.all([fetchedCopy, caches.open(cacheName)])
      .then(([response, cache]) => cache.put(evt.request, response))
      .catch((_) => {
        /* eat any errors */
      })
  )
}

function fromCacheOrFetch(evt) {
  const cached = caches.match(evt.request.url)
  const fetched = fetch(evt.request)

  evt.respondWith(
    Promise.race([fetched.catch((_) => cached), cached])
      .then((resp) => resp || fetched)
      .catch((_) => new Response(null, { status: 404 }))
  )
}

async function cacheImages(forceReload = false) {
  let breedRes
  const cache = await caches.open(cacheName)
  breedRes = await cache.match(breadListApi)
  if (!breedRes) {
    try {
      breedRes = await fetch(breadListApi)
    } catch (e) {
      console.log('failed', e)
    }
    if (breedRes && breedRes.ok) {
      await cache.put(breadListApi, breedRes.clone())
    } else return
  }

  const { message } = await breedRes.json()
  const images = Promise.all(
    message.map(async (breed) => {
      try {
        let res
        const url = `https://dog.ceo/api/breed/${breed}/images`
        if (!forceReload) {
          res = await cache.match(url)
          if (res) {
            const data = await res.json()
            return data
          }
        }

        try {
          res = await fetch(url)
        } catch (e) {
          console.error('fetching images failed')
        }

        if (res && res.ok) {
          await cache.put(url, res.clone())
        }
        const data = await res.json()
        return data
      } catch (err) {
        return { message: [] }
      }
    })
  )
  const result = await images
  const imageUrls = result.flatMap((res) => {
    if (res.message && res.message.length) return res.message[0]
    return []
  })

  return Promise.all(
    imageUrls.map(async (url) => {
      try {
        let res
        if (!forceReload) {
          res = await cache.match(url)
          if (res) {
            return res
          }
        }

        res = await fetch(url)

        if (res && res.ok) {
          await cache.put(url, res.clone())
        }
        return res
      } catch (err) {
        return
      }
    })
  )
}

const cachePattern = /^dogs-\d+$/

// clean up caches with old version number
async function clearCaches() {
  const keys = await caches.keys()
  const expiredKeys = keys.filter((key) => {
    return cachePattern.test(key) && key !== cacheName
  })
  return Promise.all(expiredKeys.map((name) => caches.delete(name)))
}
