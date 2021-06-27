<script lang="ts">
  export let src: string
  export let name: string
</script>

<div class="img-wrapper">
  <h3>{name}</h3>
  <img {src} alt={name} />
</div>

<style>
  .img-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: no-wrap;
    justify-content: center;
    align-content: flex-start;
    align-items: center;
  }

  h3 {
    font-weight: 400;
    text-transform: uppercase;
  }

  img {
    width: 300px;
    height: 300px;
    border: 3px solid black;
    border-radius: 3px;
  }
</style>
