<template>
  <label class="input-content">
    <input
      class="input-field"
      type="text"
      minlength="3"
      @change="inputChange"
      :class="{ fixedTop: haveContent }"
      :name="name"
      :required="required"
    />
    <div class="input-title">
      {{ title }}
    </div>

    <div class="invalidy-feedback" v-if="required">
      Obrigatório
    </div>
  </label>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const haveContent = ref(false);

defineProps({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
  },
});

function inputChange(event: Event) {
  const target = event.target as HTMLInputElement;

  haveContent.value = !!target.value && !!target.value.length;
}
</script>

<style lang="scss" scoped>
@import 'InputContentStyle.scss';
</style>
