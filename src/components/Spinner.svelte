<div class="spinner-container">
  <div class="spinner" />
</div>

<style>
  @keyframes loading {
    to {
      transform: rotate(360deg);
    }
  }

  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--theme-color);
    border-top: 4px solid #fff;
    border-right: 4px solid #fff;
    border-bottom: 4px solid var(--theme-color-dark);
    border-left: 4px solid var(--theme-color-dark);
    animation: loading 1.2s infinite linear;
  }

  .spinner-container {
    position: absolute;
    top: 35%;
    left: 50%;
    margin: -20px 0 0 -20px;
    background: var(--theme-color);
  }
</style>
