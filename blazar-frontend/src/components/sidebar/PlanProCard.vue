<template>
  <aside class="planpro-card">
    <figure class="planpro-figure">
      <img class="planpro-image" src="../../assets/images/dashboard/plan-pro.png" />
    </figure>

    <button type="button" class="planpro-button" @click="navigateToAssigns">
      plano pro
    </button>
  </aside>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter()

function navigateToAssigns() {
  router.push({ name: '' });
}
</script>

<style lang="scss" scoped>
@import 'PlanProCardStyle.scss';
</style>
