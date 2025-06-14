<template>
  <nav class="fs-navigation">
    <template v-for="(data, index) in options" :key="index">
      <button
        type="button"
        class="select-page"
        :class="{
          'current-page': data.routeName === router.currentRoute.value.name,
        }"
        @click="data.action"
      >
        <span class="material-icons" translate="no">
          {{ data.icon }}
        </span>

        <div class="page-describe">
          <span>
            {{ data.describe }}
          </span>

          <span class="material-icons md-rounded" translate="no">
            navigate_next
          </span>
        </div>
      </button>

      <hr class="fs-divider" v-if="index < options.length - 1" />
    </template>
  </nav>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';

type Options = Array<{
  icon: string;
  describe: string;
  routeName: string;
  action: (param: string) => void;
}>;

const router = useRouter();
defineProps({
  options: {
    type: Array as PropType<Options>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
@import 'NavigationSectionStyle.scss';
</style>
