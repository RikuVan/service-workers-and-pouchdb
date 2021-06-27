<script lang="ts">
  import { onMount } from 'svelte'
  import DogIcon from '../public/dog.svg?component'
  import PouchDB from 'pouchdb-browser'
  import Button from './components/Button.svelte'
  import type { Friend } from './@types'

  export let navigate: (uri: string, replace?: boolean) => void

  let db = new PouchDB('db')

  PouchDB.sync('db', 'http://localhost:5984/dog-friends', {
    live: true,
    retry: true,
  })
    .on('change', async function (info) {
      await updateFriends()
    })
    .on('error', function (err) {
      console.log('Replication error:', err)
    })

  let name = ''
  let breed = ''
  let availableFrom = ''
  let availableTo = ''
  let place = ''
  let loading = true
  let friends: Friend[]

  function reset() {
    name = ''
    breed = ''
    availableFrom = ''
    availableTo = ''
    place = ''
  }

  async function updateFriends() {
    const allDocs = await db.allDocs({
      include_docs: true,
    })
    friends = allDocs.rows.map((row) => row.doc as any as Friend)
    loading = false
  }

  async function add(event: Event) {
    const newFriend = {
      name,
      breed,
      availableFrom,
      availableTo,
      place,
      createdAt: new Date().toISOString(),
    }
    const addition = await db.post(newFriend)
    if (addition.ok) {
      await updateFriends()
    }
    reset()
  }

  onMount(async () => {
    await updateFriends()
  })
</script>

<nav>
  <Button on:click={() => navigate('/')} class="nav-button">Gallery</Button>
</nav>
<div class="dog-friends-page">
  <h1>Dog Friends</h1>
  <DogIcon class="dog-header-icon" />
  <form on:submit|preventDefault={add}>
    <fieldset>
      <legend>Add dog</legend>
      <p>
        <label for="name">name</label>
        <input id="name" bind:value={name} type="text" />
      </p>
      <p>
        <label for="breed">Breed</label>
        <input id="breed" bind:value={breed} type="text" />
      </p>
      <p>
        <label for="availableFrom">Available from</label>
        <input id="availableFrom" bind:value={availableFrom} type="time" />
      </p>
      <p>
        <label for="AvailableTo">Available to</label>
        <input id="availableTo" bind:value={availableTo} type="time" />
      </p>
      <p>
        <label for="place">Place</label>
        <input id="place" bind:value={place} type="text" />
      </p>
      <p>
        <button type="submit">Submit</button>
      </p>
    </fieldset>
  </form>
  <div class="dog-friend-list">
    {#if friends}
      {#each friends as friend}
        <div class="dog-card">
          <p class="card-header">
            <span>
              <DogIcon class="dog-icon" />
              <span class="dog-card-name">{friend.name}</span>
            </span>
            <span>{friend.breed}</span>
          </p>
          <p>
            <span>{friend.availableFrom} - {friend.availableTo}</span>
            <span>{friend.place}</span>
          </p>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  :root {
    --main-width: 400px;
  }

  .dog-friends-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  fieldset {
    width: 300px;
  }

  button[type='submit'] {
    float: right;
    padding: 5px;
  }

  :global(.dog-icon) {
    width: 24px;
    height: 24px;
    margin-bottom: -4px;
  }

  :global(.dog-header-icon) {
    height: 80px;
    width: 80px;
  }

  .dog-friend-list {
    margin-top: 2em;
    display: grid;
    grid-gap: 3px;
    width: 100%;
  }

  .dog-card {
    padding: 1em;
    border: 1px solid lightgray;
    border-radius: 3px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
  }

  :global(.button.nav-button) {
    margin: 0;
  }

  nav {
    padding: 1em;
  }
</style>
