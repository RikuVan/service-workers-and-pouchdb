<script lang="ts">
  export let direction: 'left' | 'right'
</script>

<button on:click class="arrow-button">
  {#if direction === 'left'}
    &#8592;
  {:else}
    &#8594;
  {/if}
</button>

<style>
  .arrow-button {
    padding: 5px 14px 6px;
    font-size: 2rem;
    border: 2px solid black;
    border-radius: 3px;
    background: #fff;
  }
  .arrow-button:hover {
    background: var(--theme-color-dark);
  }
</style>
