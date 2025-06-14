<template>
  <div class="dashboard-page">
    <SearchDashboard />
    <PreviewDashboards />
  </div>
</template>

<script lang="ts" setup>
import SearchDashboard from 'components/dashboard/search-dashboard/SearchDashboard.vue';
import PreviewDashboards from 'components/dashboard/preview-dashboards/PreviewDashboards.vue';
</script>

<style lang="scss" scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 3rem 2rem;
}
</style>
