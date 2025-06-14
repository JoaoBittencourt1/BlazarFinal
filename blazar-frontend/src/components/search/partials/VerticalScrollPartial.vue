<template>
  <div class="limit-height">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.limit-height {
  padding-right: .25rem;
  max-height: 275px;
  overflow-y: auto;
}
</style>
