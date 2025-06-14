<template>
  <div class="pagination-details">
    <em>
      Mostrando <strong>{{ amount }}</strong> de <strong>{{ length }}</strong>
      resultados de pesquisa
    </em>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    amount: {
      type: [String, Number],
      required: true,
    },
    length: {
      type: [String, Number],
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-details {
  align-self: flex-start;
  padding: 0 .5rem 1rem!important;
  width: 100%;
  color: var(--gray-400);
  border-bottom: 1px solid var(--gray-200);
  background-color: var(--white);
}
</style>
