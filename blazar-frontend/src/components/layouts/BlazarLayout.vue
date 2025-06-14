<template>
  <div class="dashboard-screen">
    <FloatingSidebar />
    <RouterView></RouterView>
  </div>
</template>

<script lang="ts">
import FloatingSidebar from '../sidebar/FloatingSidebar.vue';

export default {
  components: {
    FloatingSidebar,
  },
};
</script>

<style lang="scss" scoped>
.dashboard-screen {
  display: flex;
  width: 100vw;
  max-width: 100%;
  height: 100vh;
  max-width: 100%;
  overflow: hidden;
  background: var(--light);
}
</style>
