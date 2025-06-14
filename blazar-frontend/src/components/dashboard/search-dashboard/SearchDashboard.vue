<template>
  <section class="section">
    <div class="header">
      <h2 class="title">
        Dashboard
      </h2>

      <div class="action-group">
        <button type="button" class="new-dashboard" @click="changeModalVisibility">
          Criar dashboard
        </button>
      </div>
    </div>

    <label class="search">
      <FontIcon icon='search' size='md-16' />

      <input type='search' name='dashboard-find' placeholder='Pesquise seu dashboard por aqui...' class="input" />
    </label>
  </section>

  <GenerateDashboard
    inital-step="generate"
    is-clean
    :visibility="modalVisibility"
    :change-visibility="changeModalVisibility"
  />
</template>

<script lang="ts" setup>
import FontIcon from '../../font-icon/FontIcon.vue';
import GenerateDashboard from 'src/components/modal/GenerateDashboard.vue';
import { ref } from 'vue';

const modalVisibility = ref(false);

function changeModalVisibility() {
  modalVisibility.value = !modalVisibility.value;
}
</script>

<style lang="scss" scoped>
@import './SearchDashboard.scss';
</style>
