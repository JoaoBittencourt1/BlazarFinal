<template>
  <div class="assistent-ai" :class="{ expanded: isVisible }">
    <div class="assistent-header">
      <figure class="assistent-figure assistent-figure-logo">
        <img
          class="assistent-figure-img"
          src="../../assets/images/assistent/logo-encurtada.svg"
        />
      </figure>

      <span class="assistent-title"></span>

      <button
        type="button"
        class="assistente-btn"
        @click="toggleVisibility"
      >
        <figure class="assistent-figure assistent-figure-btn">
          <img
            class="assistent-figure-img"
            src="../../assets/images/assistent/angle-up-solid.svg"
          />
        </figure>
      </button>
    </div>

    <div class="assistent-body">
      <p class="assistent-body-content">Em construção</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

const isVisible = ref<boolean>(false);

function toggleVisibility() {
  isVisible.value = !isVisible.value;
}

export default {
  setup() {
    return {
      isVisible,
    };
  },
  methods: {
    toggleVisibility,
  },
};
</script>

<style lang="scss" scoped>
@import './assistent.scss';
</style>
