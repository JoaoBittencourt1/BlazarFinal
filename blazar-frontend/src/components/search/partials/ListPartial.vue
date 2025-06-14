<template>
  <ul
    class="list"
    :class="{
      numeric,
      lowerAlpha,
      disc,
    }"
  >
    <li
      class="item"
      v-for="({ prefix, suffix, url }, index) of items"
      :key="index"
    >
      <span class="item-box">
        {{ prefix }}

        <a v-if="url" :href="url" class="item-suffix">
          {{ suffix }}

          <q-tooltip
            anchor="top middle"
            :offset="[0, 32]"
            class="g-link-tooltip"
          >
            {{ url }}
          </q-tooltip>
        </a>

        <span v-else-if="suffix" class="item-suffix">
          {{ suffix }}

          <q-tooltip
            anchor="top middle"
            :offset="[0, 32]"
            class="g-link-tooltip"
          >
            {{ suffix }}
          </q-tooltip>
        </span>
      </span>
    </li>
  </ul>
</template>

<script lang="ts">
import type { ListStyledItems } from '../_types';

export default {
  props: {
    items: {
      type: Object as ListStyledItems,
      required: true,
    },
    numeric: {
      type: Boolean,
    },
    lowerAlpha: {
      type: Boolean,
    },
    disc: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  align-content: flex-start;

  &.numeric .item {
    list-style: decimal;
  }

  &.lowerAlpha .item {
    list-style: lower-alpha;
  }

  &.disc .item {
    list-style: disc;
  }

  .item {
    margin-left: 1.5rem;
  }

  .item-box {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .item-suffix {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: all;
  }
}
</style>
