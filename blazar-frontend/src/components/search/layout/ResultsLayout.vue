<template>
  <div class="container">
    <div class="sidebar-top">
      <figure class="figure">
        <img
          class="image"
          src="../../../assets/images/search/system-preferences.svg"
        />
      </figure>
      <span> filtros </span>
    </div>

    <div class="results-top">
      <button
        type="button"
        class="button dashboard-exportpdf"
        @click="changeModalVisibility"
      >
        gerar dashboard
      </button>

      <button type="button" class="button dashboard-save">
        <figure class="figure">
          <img
            class="image"
            src="../../../assets/images/search/save-group.svg"
          />
        </figure>
        <span> salvar </span>
      </button>
    </div>

    <section class="sidebar">
      <slot name="sidebar"></slot>
    </section>

    <section class="results" id="results-section">
      <slot name="results"></slot>
    </section>
  </div>

  <GenerateDashboard
    :visibility="modalVisibility"
    :change-visibility="changeModalVisibility"
  />
</template>

<script lang="ts" setup>
import GenerateDashboard from '../../modal/GenerateDashboard.vue';
import { ref } from 'vue';

const modalVisibility = ref(false);

function changeModalVisibility() {
  modalVisibility.value = !modalVisibility.value;
}
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  column-gap: 1rem;
  align-content: flex-start;
  grid-template-areas:
    'sidebar-top  sidebar-top results-top results-top results-top results-top'
    'sidebar      sidebar     results     results     results     results';
  grid-template-columns: repeat(6, 1fr);

  width: 100%;
  max-height: calc(100vh - 11.02rem);
  overflow: hidden;

  font-size: 1rem;
  font-weight: 400;
  font-style: normal;
}

.figure {
  .image {
    --size: 1.5rem;
    width: var(--size);
    height: var(--size);
  }
}

.sidebar-top,
.results-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0;
  background-color: var(--white);
}

.sidebar-top {
  grid-area: sidebar-top;

  span {
    font-weight: 500;
  }

  span::first-letter {
    text-transform: uppercase;
  }
}

.results-top {
  grid-area: results-top;
  justify-content: flex-end;
}

.button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 20rem;
  cursor: pointer;

  font-weight: 700;

  &.dashboard-exportpdf {
    color: var(--white);
    background-color: var(--primary);
    background-image: var(--grad-deg-purple);
    text-transform: uppercase;

    transition: box-shadow 0.21s ease-out;

    &:hover {
      box-shadow: var(--dashboard-button-shadow);
    }
  }

  &.dashboard-save {
    color: var(--muted);
    border: 1px solid var(--secondary);
    background-color: var(--white);

    transition: background-color 0.21s ease-out;

    span::first-letter {
      text-transform: uppercase;
    }

    &:hover {
      color: var(gray-500);
      background-color: var(--blue-200);
    }
  }
}

.sidebar,
.results {
  padding: 0.25rem 0.25rem 1rem;
  max-height: calc(100vh - 17.71rem);
  overflow-y: auto;

  scroll-behavior: smooth;
  scrollbar-color: transparent transparent;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  grid-area: sidebar;
}

.results {
  grid-area: results;
}
</style>
