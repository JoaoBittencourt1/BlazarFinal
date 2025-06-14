<template>
  <div v-if="uses.length">
    <div v-for="(item, index) in uses" :key="index">
      <div v-for="(use, index) in item" :key="index">
        {{ use }}
        <q-separator class="q-ma-sm" />
      </div>
    </div>
  </div>
  <not-found v-else />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { extractMoleculeInformation } from 'components/search-engine/tabs/molecules/MoleculesService';
import NotFound from 'components/search-engine/tabs/molecules/NotFoundInformation.vue';
import Information from 'components/types/Information';

export default defineComponent({
  name: 'NamesAndIdentifiers',
  props: {
    data: {
      type: Object,
      require: true,
    },
  },
  components: { NotFound },
  setup: function (props) {
    let uses = ref([]);

    let useInformation = extractMoleculeInformation(props.data);

    uses.value = useInformation.map((information: Information) => {
      return information?.Value?.StringWithMarkup?.map((informationValue) => {
        return informationValue?.String;
      });
    });

    return {
      uses,
    };
  },
});
</script>

<style scoped></style>
