<template>
  <button :type="type" class="button-component" :class="[format]">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import type { TypeProp, FormatProp } from './ButtonTypes';

defineProps({
  type: {
    type: String as TypeProp,
    default() {
      return 'button';
    },
  },
  format: {
    type: String as FormatProp,
    default() {
      return 'muted';
    },
  },
});
</script>

<style lang="scss" scoped>
@import 'ButtonComponentStyles.scss';
</style>
