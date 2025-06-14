<template>
  <p>
    {{ message }}
  </p>
</template>

<script lang="ts" setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>
