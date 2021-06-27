<script lang="ts">
  export let active: boolean = false
  let _class = ''
  export { _class as class }
</script>

<button on:click class={'button ' + _class} class:active><slot /></button>

<style>
  .button {
    display: flex;
    min-width: 10px;
    border-radius: 3px;
    font-size: 1rem;
    text-transform: uppercase;
    padding: 8px;
    margin: 5px;
    border: 2px solid black;
    background: #fff;
  }

  .button:hover {
    background: var(--theme-color-light);
  }

  .active {
    background: var(--theme-color-dark);
  }
</style>
