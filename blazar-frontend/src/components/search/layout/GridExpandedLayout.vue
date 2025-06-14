<template>
  <div class="grid-container" :class="gridStyle">
    <header class="grid-header">
      <slot name="header"></slot>
    </header>

    <section v-for="index of 5" :key="index" :class="`grid-info-${index}`">
      <slot :name="`info${index}`"></slot>
    </section>

    <main class="grid-main">
      <slot name="main"></slot>
    </main>

    <aside class="grid-sidebar">
      <slot name="sidebar"></slot>
    </aside>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { Categories } from '../_types';

export default {
  props: {
    gridStyle: {
      type: String as PropType<Categories>,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin genInfoGrid($amount) {
  @for $index from 1 through $amount {
    .grid-info-#{$index} {
      grid-area: #{'info'}#{$index};
    }
  }
}

.grid-container {
  &,
  & * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
  }

  display: grid;
  overflow-y: auto;
  gap: 1rem;
  align-content: flex-start;
  padding: 1.5rem !important;
  width: 100%;
  min-height: min-content;
  height: 100%;
  max-height: 100%;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  background-color: var(--light);

  &::before {
    content: '';
    position: absolute;
    z-index: -1050;
    inset: 0;
    background-color: var(--white);
  }

  &.publications {
    grid-template-areas:
      'header header  header  header  header  header  header  header'
      'info1  info1   info2   info2   info3   info3   info4   info4'
      'main   main    main    main    main    sidebar sidebar sidebar';
    grid-template-columns: repeat(8, 1fr);

    @include genInfoGrid(4);
  }

  &.patents {
    grid-template-areas:
      'header header  header  header  header  header  header  header  header'
      'info1  info1   info1   info2   info2   info2   sidebar sidebar sidebar'
      'main   main    main    main    main    main    sidebar sidebar sidebar';
    grid-template-columns: repeat(9, 1fr);

    @include genInfoGrid(2);
  }

  &.molecules {
    grid-template-areas:
      'header header  header  header  header  header  header  header'
      'main   main    main    main    main    sidebar sidebar sidebar'
      'main   main    main    main    main    sidebar sidebar sidebar';
    grid-template-columns: repeat(8, 1fr);
  }

  &.clinicalTrials {
    grid-template-areas:
      'header header  header  header  header'
      'info1  info2   info3   info4   info5'
      'main   main    main    sidebar sidebar';
    grid-template-columns: repeat(5, 1fr);

    @include genInfoGrid(5);
  }
}

.grid-header,
.grid-main,
.grid-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.grid-header {
  grid-area: header;
}

.grid-main {
  grid-area: main;
}

.grid-sidebar {
  grid-area: sidebar;
}
</style>
