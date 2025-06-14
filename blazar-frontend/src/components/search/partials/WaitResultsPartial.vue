<template>
  <div class="wait-results">
    <figure class="wait-results-figure">
      <img class="wait-results-image" src="../../../assets/images/search/icon-screen.svg" />
      <figcaption class="wait-results-figcaption">
        Por favor, preencha as informações de busca e clique em 'Pesquisar' para
        gerar sua consulta.
      </figcaption>
    </figure>
  </div>
</template>

<style lang="scss" scoped>
.wait-results {
  margin: 7rem auto!important;
  padding: 1rem;
  color: var(--muted);
  pointer-events: none;
  user-select: none;

  animation: var(--fade-in);

  &-figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    margin: auto;
    width: 420px;
    max-width: 100%;
  }

  &-image {
    width: 70%;
  }

  &-figcaption {
    font-size: 1rem;
    font-weight: 400;
  }
}
</style>
