<script lang="ts">
  import Button from './components/Button.svelte'
  import { getBreeds, getImagesForBreeds } from './api'
  import ArrowButton from './components/ArrowButton.svelte'
  import type { Observable } from 'rxjs'
  import Image from './components/Image.svelte'
  import Spinner from './components/Spinner.svelte'
  import randomColor from 'randomcolor'
  import darken from 'polished/lib/color/darken'
  import lighten from 'polished/lib/color/lighten'
  import { networkStatusStore } from './networkStatusStore'

  export let navigate: (uri: string, replace?: boolean) => void

  let images: Observable<string[]>
  let letters: string[] = []
  let loading: boolean = false
  let currentIndex = 0
  const breeds = getBreeds()
  let themeColor = randomColor({ luminosity: 'light' })
  const online = networkStatusStore()

  function setcurrentIndex(idx: number) {
    currentIndex = idx
  }

  function decrementIndex() {
    if (currentIndex > 0) currentIndex--
  }

  function incrementIndex() {
    if (currentIndex < letters.length - 1) currentIndex++
  }

  $: if ($breeds) letters = Object.keys($breeds)
  $: if ($breeds && currentIndex + 1) {
    loading = true
    images = getImagesForBreeds($breeds[letters[currentIndex]], $online)
    themeColor = randomColor({ luminosity: 'light' })
  }
  $: if ($images && loading) {
    loading = false
  }
</script>

<div
  class="page-wrapper"
  style="background: var(--theme-color);
    --theme-color: {themeColor}; --theme-color-dark: {darken(0.1, themeColor)};
    --theme-color-light:{lighten(0.1, themeColor)}"
>
  <Button active={false} class="nav-button" on:click={() => navigate('/dog-friends')}
    >Dog Friends</Button
  >
  <h1>Gallery</h1>
  <nav class="letters">
    {#each letters as letter, i}
      <Button active={i === currentIndex} on:click={() => setcurrentIndex(letters.indexOf(letter))}>
        {letter}
      </Button>
    {/each}
  </nav>
  <nav class="direction-buttons">
    <ArrowButton direction="left" on:click={decrementIndex} />
    <ArrowButton direction="right" on:click={incrementIndex} />
  </nav>
  <main>
    {#if loading || !$images}
      <Spinner />
    {:else}
      {#each $images as src, i}
        <Image {src} name={$breeds[letters[currentIndex]][i]} />
      {/each}
    {/if}
  </main>
</div>

<style>
  .page-wrapper {
    padding: 1em;
  }

  h1 {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    text-align: center;
    margin-top: 0;
    padding: 1em 0;
  }
  nav.letters {
    display: flex;
    justify-content: center;
    align-items: space-around;
  }

  .direction-buttons {
    display: flex;
    justify-content: center;
    align-items: space-around;
    padding-top: 10px;
  }

  .direction-buttons > :global(button:last-of-type) {
    margin-left: 3px;
  }

  main {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    padding: 2em 2em 20em 2em;
    min-height: 50vh;
  }

  :global(.button.nav-button) {
    margin: 0;
  }
</style>
