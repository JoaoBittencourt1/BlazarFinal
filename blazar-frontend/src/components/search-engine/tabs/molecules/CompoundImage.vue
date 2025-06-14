<template>
  <div>
    <div>
      <q-img :src="image" style="width: 350px; height: 350px" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CompoundImage',
  props: {
    data: {
      type: Blob,
      required: true,
    },
  },
  setup(props) {
    const image = URL.createObjectURL(props.data);
    return {
      image,
    };
  },
});
</script>

<style scoped></style>
