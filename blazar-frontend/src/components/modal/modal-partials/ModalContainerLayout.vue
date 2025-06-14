<template>
  <div
    class="modal-container-layout"
    data-component="cover-modal"
    @click="handleBackgroundClick"
    v-if="visibility"
  >
    <section class="dialog">
      <header class="header">
        <h2 class="title">
          <slot name="title"></slot>
        </h2>

        <button type="button" class="button-modal" @click="changeVisibility">
          <FontIcon icon='close' />
        </button>
      </header>

      <div class="body">
        <slot name="content"></slot>
      </div>

      <footer class="footer" :class="[footerAlign]">
        <slot name="action"></slot>
      </footer>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { ModalContainerLayoutProps } from './ModalTypes';
import FontIcon from 'components/font-icon/FontIcon.vue';

const props = defineProps<ModalContainerLayoutProps>();

function handleBackgroundClick(mouseEvent: MouseEvent): void {
  const element = mouseEvent.target as HTMLElement;

  if (element.dataset.component == 'cover-modal') {
    props.changeVisibility();
  }
}
</script>

<style lang="scss" scoped>
@import 'ModalContainerLayoutStyle.scss';
</style>
