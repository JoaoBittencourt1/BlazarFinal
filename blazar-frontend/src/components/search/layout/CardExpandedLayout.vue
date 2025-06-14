<template>
  <article class="card-container" :class="{ fitHeight }">
    <slot></slot>
  </article>
</template>

<script lang="ts">
export default {
  props: {
    fitHeight: {
      type: Boolean,
    },
    saveWasClicked: {
      type: String,
      required: false,
      default: () => undefined,
    },
  },
};
</script>

<style lang="scss" scoped>
.card-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1.5rem;
  border-radius: 1.5rem;
  background-color: var(--white);

  &.fitHeight {
    height: 100%;
  }
}
</style>
