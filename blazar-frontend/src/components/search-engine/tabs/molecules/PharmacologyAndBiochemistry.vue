<template>
  <div v-if="tissueLocations.length || cellularLocations.length">
    <div>
      <strong>Localização tecidual</strong>
      <div v-for="(item, index) in tissueLocations" :key="index">
        <div v-for="(use, index) in item" :key="index">
          {{ use }}
        </div>
      </div>
    </div>
    <q-separator class="q-ma-sm" />
    <div>
      <strong>Localização celular</strong>
      <div v-for="(item, index) in cellularLocations" :key="index">
        <div v-for="(use, index) in item" :key="index">
          {{ use }}
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
  name: 'PharmacologyAndBiochemistry',
  components: { NotFound },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup: function (props) {
    let cellularLocations = ref([]);
    let tissueLocations = ref([]);

    let cellularLocationsInformation = extractMoleculeInformation(
      props.data.cellularLocations
    );
    let tissueLocationsInformation = extractMoleculeInformation(
      props.data.tissueLocations
    );

    //@todo type
    cellularLocations.value = cellularLocationsInformation.map(
      (information: Information) => {
        return information?.Value?.StringWithMarkup?.map((informationValue) => {
          return informationValue?.String;
        });
      }
    );

    //@todo type
    tissueLocations.value = tissueLocationsInformation.map(
      (information: Information) => {
        return information?.Value?.StringWithMarkup?.map((informationValue) => {
          return informationValue?.String;
        });
      }
    );

    return {
      tissueLocations,
      cellularLocations,
    };
  },
});
</script>

<style scoped></style>
