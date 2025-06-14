<template>
  <figure class="no-dashboard">
    <IconDashboardScreen class="icon-screen" />
    <div class="description">
      <p>Você não possui nenhum dashboard.</p>
      <p>Clique no botão "Criar Dashboard" para começar.</p>
    </div>
  </figure>
</template>

<script lang="ts" setup>
import IconDashboardScreen from 'components/icons/DashboardScreen.vue';
</script>

<style lang="scss" scoped>
@import './PreviewDashboards.scss';
</style>
