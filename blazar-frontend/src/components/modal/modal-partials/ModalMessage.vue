
<template>
  <div class="modal-message">
    <figure>
      <FontIcon icon='done' />
    </figure>

    <p class="message">
      <slot></slot>
    </p>
  </div>
</template>

<script lang="ts" setup>
import FontIcon from 'src/components/font-icon/FontIcon.vue';
</script>

<style lang="scss" scoped>
@import 'ModalMessageStyle.scss';
</style>
