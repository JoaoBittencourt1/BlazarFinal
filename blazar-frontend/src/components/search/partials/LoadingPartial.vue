<template>
  <figure class="loading-figure">
    <div class="coffee-animation"></div>

    <span class="loading-bar"></span>

    <figcaption>Aguarde, estamos gerando sua pesquisa...</figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.loading-figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  margin: 7rem auto!important;
  width: 420px;
  max-width: 100%;
  font-size: 1rem;

  animation: var(--fade-in);

  figcaption {
    color: var(--muted);
    font-size: 1rem;
  }
}

.coffee-animation {
  position: relative;

  --size: 22rem;
  width: var(--size);
  height: var(--size);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/images/loading-coffee.gif') no-repeat;
    background-position: -25px -15px;
    background-size: 130%;
  }
}

.loading-bar {
  position: relative;

  overflow: hidden;
  width: 100%;
  height: 1rem;
  border-radius: 5rem;
  background-color: var(--gray-200);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 5%;
    background-color: var(--secondary);
    background-image: var(--grad-deg-purple);

    animation: var(--progress-bar-anim);
  }
}
</style>
