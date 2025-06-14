<template>
  <div class="dashboards-selection">
    <h3 class="title">Seus dashboards</h3>

    <div class="body" @click="handleClick">
      <button
        type="button"
        class="option"
        v-for="(data, index) in dashboards"
        :key="index"
        :data-dashboard-id="data.id"
      >
        {{ data.title }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DashboardsSelectionProp } from './ModalTypes';

defineProps({
  dashboards: {
    type: Array as DashboardsSelectionProp,
    default() {
      return Array(3).fill({
        id: 5,
        title: 'Dashboard title',
      });
    },
  },
});

function handleClick(mouseEvent: MouseEvent) {
  const element = mouseEvent.target as HTMLElement;
  const dashboardSelected = Number(element.dataset.dashboardId);

  if (!(dashboardSelected >= 0)) return;
}
</script>

<style lang="scss" scoped>
@import 'DashboardsSelectionStyle.scss';
</style>
