import { readable } from 'svelte/store'

export const networkStatusStore = () =>
  readable(navigator.onLine, function start(set) {
    const setOnline = () => {
      set(true)
    }
    const setOffline = () => {
      set(false)
    }
    window.addEventListener('online', setOnline)
    window.addEventListener('offline', setOffline)

    return function stop() {
      window.removeEventListener('online', setOnline)
      window.removeEventListener('offline', setOffline)
    }
  })
