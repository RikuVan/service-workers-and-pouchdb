<script lang="ts">
  import { onDestroy } from 'svelte'
  import OnlineIcon from '../public/zap.svg?component'
  import OfflineIcon from '../public/zap-off.svg?component'
  import navaid from 'navaid'
  import type { Params } from 'navaid'
  import Gallery from './Gallery.svelte'
  import DogFriends from './DogFriends.svelte'
  import { networkStatusStore } from './networkStatusStore'

  let currentPage = Gallery
  let params: Params = {}
  let active: string = 'gallery'
  let online = networkStatusStore()

  const router = navaid()
    .on('/', handleRoute('gallery', Gallery))
    .on('/dog-friends', handleRoute('dog-friends', DogFriends))
    .listen()

  function handleRoute(name: string, page: any) {
    return (routeParams: Params) => {
      currentPage = page
      params = routeParams
      active = name
    }
  }

  onDestroy(() => {
    if (router) router.unlisten()
  })
</script>

<svelte:component this={currentPage} navigate={router.route} />
<div class="online-status">
  {#if $online}
    <OnlineIcon />
  {:else}
    <OfflineIcon />
  {/if}
</div>

<style>
  .online-status {
    position: absolute;
    right: 20px;
    top: 20px;
  }
  :global(.feather-zap),
  :global(.feather-zap-off) {
    height: 48px;
    width: 48px;
  }
</style>
