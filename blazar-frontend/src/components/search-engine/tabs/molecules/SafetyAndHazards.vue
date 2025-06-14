<template>
  <div v-if="hazardsSummary.length">
    <div>
      <strong>Resumo dos riscos</strong>
      <div v-for="(item, index) in hazardsSummary" :key="index">
        <div v-for="(use, index) in item" :key="index">
          {{ use }}
          <q-separator class="q-ma-sm" />
        </div>
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
  name: 'SafetyAndHazards',
  components: { NotFound },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup: function (props) {
    let hazardsSummary = ref([]);
    let hazardsSummaryInformation = extractMoleculeInformation(props.data);
    //@todo type
    hazardsSummary.value = hazardsSummaryInformation.map(
      (information: Information) => {
        return information?.Value?.StringWithMarkup?.map((informationValue) => {
          return informationValue?.String;
        });
      }
    );

    return {
      hazardsSummary,
    };
  },
});
</script>

<style scoped></style>
